import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createChartDBRepositories } from '../chartdb-repositories';
import type { ChartDBDexie } from '@/storage/db/chartdb-dexie';
import type { Diagram } from '@/lib/domain/diagram';
import type { DBTable } from '@/lib/domain/db-table';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import { DatabaseType } from '@/lib/domain/database-type';

const createMemoryTable = <T extends { id: string | number }>() => {
    const rows = new Map<string | number, T>();

    const matches = (row: T, query: Partial<T>) =>
        Object.entries(query).every(
            ([key, value]) => (row as Record<string, unknown>)[key] === value
        );

    const getRowId = (row: T) => row.id;

    const byIndex = (key: keyof T, value: unknown) =>
        Array.from(rows.values()).filter((row) => row[key] === value);

    return {
        add: async (row: T) => {
            rows.set(getRowId(row), { ...row });
        },
        put: async (row: T) => {
            rows.set(getRowId(row), { ...row });
        },
        get: async (query: Partial<T> | string | number) => {
            if (typeof query === 'string' || typeof query === 'number') {
                return rows.get(query);
            }

            return Array.from(rows.values()).find((row) => matches(row, query));
        },
        update: async (id: string | number, attributes: Partial<T>) => {
            const row = rows.get(id);
            if (row) {
                rows.set(id, { ...row, ...attributes });
            }
        },
        delete: async (id: string | number) => {
            rows.delete(id);
        },
        toArray: async () => Array.from(rows.values()),
        where: (queryOrKey: Partial<T> | keyof T) => {
            if (typeof queryOrKey === 'string') {
                return {
                    equals: (value: unknown) => {
                        const selected = () => byIndex(queryOrKey, value);

                        return {
                            delete: async () => {
                                selected().forEach((row) =>
                                    rows.delete(getRowId(row))
                                );
                            },
                            modify: async (attributes: Partial<T>) => {
                                selected().forEach((row) =>
                                    rows.set(getRowId(row), {
                                        ...row,
                                        ...attributes,
                                    })
                                );
                            },
                            toArray: async () => selected(),
                        };
                    },
                };
            }

            return {
                delete: async () => {
                    Array.from(rows.values())
                        .filter((row) => matches(row, queryOrKey as Partial<T>))
                        .forEach((row) => rows.delete(getRowId(row)));
                },
            };
        },
        snapshot: () =>
            new Map(
                Array.from(rows.entries()).map(([id, row]) => [id, { ...row }])
            ),
        restore: (snapshot: Map<string | number, T>) => {
            rows.clear();
            snapshot.forEach((row, id) => rows.set(id, row));
        },
    };
};

type MemoryTable = ReturnType<
    typeof createMemoryTable<{ id: string | number }>
>;

const createTestDb = () => {
    const tables = {
        diagrams: createMemoryTable<Diagram>(),
        db_tables: createMemoryTable<DBTable & { diagramId: string }>(),
        db_relationships: createMemoryTable<
            DBRelationship & { diagramId: string }
        >(),
        db_dependencies: createMemoryTable(),
        areas: createMemoryTable(),
        db_custom_types: createMemoryTable<
            DBCustomType & { diagramId: string }
        >(),
        notes: createMemoryTable(),
        config: createMemoryTable(),
        diagram_filters: createMemoryTable(),
    };

    return {
        ...tables,
        transaction: async (_mode: string, ...args: unknown[]) => {
            const callback = args.at(-1) as () => Promise<void>;
            const tableList = Object.values(tables) as MemoryTable[];
            const snapshots = tableList.map((table) => table.snapshot());

            try {
                await callback();
            } catch (error) {
                tableList.forEach((table, index) => {
                    table.restore(snapshots[index]);
                });
                throw error;
            }
        },
    } as unknown as ChartDBDexie;
};

const createDiagram = (id = 'diagram-1'): Diagram => ({
    id,
    name: 'Billing',
    databaseType: DatabaseType.POSTGRESQL,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
});

const createTable = (id: string, name: string): DBTable => ({
    id,
    name,
    fields: [],
    indexes: [],
    x: 0,
    y: 0,
    color: '#ffffff',
    isView: false,
    createdAt: 1,
    width: 200,
});

describe('ChartDB repositories', () => {
    it('adds and reads diagrams with included child entities', async () => {
        const repositories = createChartDBRepositories(createTestDb());
        const diagram = createDiagram();

        await repositories.diagrams.add({
            diagram: {
                ...diagram,
                tables: [createTable('table-1', 'users')],
                relationships: [
                    {
                        id: 'relationship-b',
                        name: 'z_rel',
                    } as DBRelationship,
                    {
                        id: 'relationship-a',
                        name: 'a_rel',
                    } as DBRelationship,
                ],
                customTypes: [
                    { id: 'type-b', name: 'uuidz' } as DBCustomType,
                    { id: 'type-a', name: 'alpha' } as DBCustomType,
                ],
            },
        });

        const stored = await repositories.diagrams.get(diagram.id, {
            includeTables: true,
            includeRelationships: true,
            includeCustomTypes: true,
        });

        expect(stored?.tables?.map((table) => table.id)).toEqual(['table-1']);
        expect(
            stored?.relationships?.map((relationship) => relationship.name)
        ).toEqual(['a_rel', 'z_rel']);
        expect(
            stored?.customTypes?.map((customType) => customType.name)
        ).toEqual(['alpha', 'uuidz']);
    });

    it('cascades diagram id updates to child entity records', async () => {
        const repositories = createChartDBRepositories(createTestDb());

        await repositories.diagrams.add({
            diagram: {
                ...createDiagram('old-diagram'),
                tables: [createTable('table-1', 'users')],
            },
        });

        await repositories.diagrams.update({
            id: 'old-diagram',
            attributes: { id: 'new-diagram' },
        });

        await expect(
            repositories.tables.list('old-diagram')
        ).resolves.toHaveLength(0);
        await expect(
            repositories.tables.list('new-diagram')
        ).resolves.toHaveLength(1);
    });

    it('returns undefined when a scoped entity is missing', async () => {
        const repositories = createChartDBRepositories(createTestDb());

        await expect(
            repositories.tables.get({
                diagramId: 'diagram-1',
                id: 'missing-table',
            })
        ).resolves.toBeUndefined();
    });

    it('deletes diagram filter with diagram records', async () => {
        const repositories = createChartDBRepositories(createTestDb());
        const diagram = createDiagram();

        await repositories.diagrams.add({ diagram });
        await repositories.diagramFilters.update(diagram.id, {
            tableIds: ['table-1'],
            schemaIds: [],
        });

        await repositories.diagrams.delete(diagram.id);

        await expect(
            repositories.diagrams.get(diagram.id)
        ).resolves.toBeUndefined();
        await expect(
            repositories.diagramFilters.get(diagram.id)
        ).resolves.toBeUndefined();
    });

    it('keeps StorageProvider behind repository APIs instead of Dexie tables', () => {
        const provider = fs.readFileSync(
            'src/context/storage-context/storage-provider.tsx',
            'utf8'
        );

        expect(provider).toContain('createChartDBRepositories');
        expect(provider).not.toMatch(/\bdb\.(diagrams|db_tables|notes)\b/);
    });
});
