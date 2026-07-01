import { describe, expect, it } from 'vitest';
import { createDiagramTransactionService } from '../diagram-transaction-service';
import type { ChartDBDexie } from '@/storage/db/chartdb-dexie';
import type { Diagram } from '@/lib/domain/diagram';
import type { DBTable } from '@/lib/domain/db-table';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { DatabaseType } from '@/lib/domain/database-type';

const createMemoryTable = <T extends object>() => {
    let rows = new Map<string | number, T>();

    const matches = (row: T, query: Partial<T>) =>
        Object.entries(query).every(
            ([key, value]) => (row as Record<string, unknown>)[key] === value
        );

    const getRowId = (row: T) =>
        ((row as Record<string, unknown>).id ??
            (row as Record<string, unknown>).diagramId) as string | number;

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
            rows = new Map(snapshot);
        },
    };
};

type MemoryTable = ReturnType<typeof createMemoryTable<object>>;

const createTestDb = () => {
    const tables = {
        diagrams: createMemoryTable<Diagram>(),
        db_tables: createMemoryTable<DBTable & { diagramId: string }>(),
        db_relationships: createMemoryTable(),
        db_dependencies: createMemoryTable(),
        areas: createMemoryTable(),
        db_custom_types: createMemoryTable(),
        notes: createMemoryTable(),
        diagram_filters: createMemoryTable<
            DiagramFilter & { diagramId: string }
        >(),
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

const createTable = (id: string): DBTable => ({
    id,
    name: 'users',
    fields: [],
    indexes: [],
    x: 0,
    y: 0,
    color: '#ffffff',
    isView: false,
    createdAt: 1,
    width: 200,
});

describe('diagram transaction service', () => {
    it('rolls back a diagram import when a child entity write fails', async () => {
        const db = createTestDb();
        const service = createDiagramTransactionService(db);

        (db.db_tables as unknown as { add: () => Promise<never> }).add =
            async () => {
                throw new Error('table write failed');
            };

        await expect(
            service.addDiagramWithChildren({
                diagram: {
                    ...createDiagram(),
                    tables: [createTable('table-1')],
                },
            })
        ).rejects.toThrow('table write failed');

        await expect(db.diagrams.toArray()).resolves.toHaveLength(0);
        await expect(db.db_tables.toArray()).resolves.toHaveLength(0);
    });

    it('deletes a diagram, its children, and its filter in one transaction', async () => {
        const db = createTestDb();
        const service = createDiagramTransactionService(db);
        const diagram = createDiagram();

        await service.addDiagramWithChildren({
            diagram: {
                ...diagram,
                tables: [createTable('table-1')],
            },
        });
        await db.diagram_filters.put({
            diagramId: diagram.id,
            tableIds: ['table-1'],
            schemaIds: [],
        });

        await service.deleteDiagramWithChildren(diagram.id);

        await expect(db.diagrams.toArray()).resolves.toHaveLength(0);
        await expect(db.db_tables.toArray()).resolves.toHaveLength(0);
        await expect(db.diagram_filters.toArray()).resolves.toHaveLength(0);
    });
});
