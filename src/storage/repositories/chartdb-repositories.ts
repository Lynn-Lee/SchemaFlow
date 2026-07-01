import type { Area } from '@/lib/domain/area';
import type { ChartDBConfig } from '@/lib/domain/config';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Diagram } from '@/lib/domain/diagram';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import type { Note } from '@/lib/domain/note';
import type { ChartDBDexie } from '@/storage/db/chartdb-dexie';
import { createDiagramTransactionService } from '@/storage/transactions/diagram-transaction-service';

type DiagramListOptions = {
    includeTables?: boolean;
    includeRelationships?: boolean;
    includeDependencies?: boolean;
    includeAreas?: boolean;
    includeCustomTypes?: boolean;
    includeNotes?: boolean;
};

type DiagramScoped<T> = T & { diagramId: string };

type DiagramScopedTable<T extends { id: string }> = {
    add: (row: DiagramScoped<T>) => Promise<unknown>;
    put: (row: DiagramScoped<T>) => Promise<unknown>;
    get: (query: {
        id: string;
        diagramId: string;
    }) => Promise<DiagramScoped<T> | undefined>;
    update: (id: string, attributes: Partial<T>) => Promise<unknown>;
    where: {
        (query: { id: string; diagramId: string }): {
            delete: () => Promise<unknown>;
        };
        (key: 'diagramId'): {
            equals: (diagramId: string) => {
                delete: () => Promise<unknown>;
                modify: (
                    attributes: Partial<DiagramScoped<T>>
                ) => Promise<unknown>;
                toArray: () => Promise<DiagramScoped<T>[]>;
            };
        };
    };
};

const createDiagramScopedRepository = <T extends { id: string }>(
    table: DiagramScopedTable<T>,
    options: {
        sort?: (a: T, b: T) => number;
    } = {}
) => ({
    add: async ({ diagramId, item }: { diagramId: string; item: T }) => {
        await table.add({ ...item, diagramId });
    },
    get: async ({
        diagramId,
        id,
    }: {
        diagramId: string;
        id: string;
    }): Promise<T | undefined> => {
        return await table.get({ id, diagramId });
    },
    update: async ({
        id,
        attributes,
    }: {
        id: string;
        attributes: Partial<T>;
    }) => {
        await table.update(id, attributes);
    },
    put: async ({ diagramId, item }: { diagramId: string; item: T }) => {
        await table.put({ ...item, diagramId });
    },
    delete: async ({ diagramId, id }: { diagramId: string; id: string }) => {
        await table.where({ id, diagramId }).delete();
    },
    list: async (diagramId: string): Promise<T[]> => {
        const rows = await table.where('diagramId').equals(diagramId).toArray();

        return options.sort ? rows.sort(options.sort) : rows;
    },
    deleteDiagramItems: async (diagramId: string) => {
        await table.where('diagramId').equals(diagramId).delete();
    },
    updateDiagramId: async (fromDiagramId: string, toDiagramId: string) => {
        await table
            .where('diagramId')
            .equals(fromDiagramId)
            .modify({ diagramId: toDiagramId } as Partial<DiagramScoped<T>>);
    },
});

export const createChartDBRepositories = (db: ChartDBDexie) => {
    const diagramTransactions = createDiagramTransactionService(db);
    const tables = createDiagramScopedRepository<DBTable>(db.db_tables);
    const relationships = createDiagramScopedRepository<DBRelationship>(
        db.db_relationships,
        {
            sort: (a, b) => a.name.localeCompare(b.name),
        }
    );
    const dependencies = createDiagramScopedRepository<DBDependency>(
        db.db_dependencies
    );
    const areas = createDiagramScopedRepository<Area>(db.areas);
    const customTypes = createDiagramScopedRepository<DBCustomType>(
        db.db_custom_types,
        {
            sort: (a, b) => a.name.localeCompare(b.name),
        }
    );
    const notes = createDiagramScopedRepository<Note>(db.notes);

    const config = {
        get: async (): Promise<ChartDBConfig | undefined> => {
            return await db.config.get(1);
        },
        update: async (attributes: Partial<ChartDBConfig>) => {
            await db.config.update(1, attributes);
        },
    };

    const diagramFilters = {
        get: async (diagramId: string): Promise<DiagramFilter | undefined> => {
            return await db.diagram_filters.get({ diagramId });
        },
        update: async (diagramId: string, filter: DiagramFilter) => {
            await db.diagram_filters.put({ diagramId, ...filter });
        },
        delete: async (diagramId: string) => {
            await db.diagram_filters.where({ diagramId }).delete();
        },
    };

    const attachIncludedChildren = async (
        diagram: Diagram,
        options: DiagramListOptions
    ): Promise<Diagram> => {
        if (options.includeTables) {
            diagram.tables = await tables.list(diagram.id);
        }

        if (options.includeRelationships) {
            diagram.relationships = await relationships.list(diagram.id);
        }

        if (options.includeDependencies) {
            diagram.dependencies = await dependencies.list(diagram.id);
        }

        if (options.includeAreas) {
            diagram.areas = await areas.list(diagram.id);
        }

        if (options.includeCustomTypes) {
            diagram.customTypes = await customTypes.list(diagram.id);
        }

        if (options.includeNotes) {
            diagram.notes = await notes.list(diagram.id);
        }

        return diagram;
    };

    const diagrams = {
        add: async ({ diagram }: { diagram: Diagram }) => {
            await diagramTransactions.addDiagramWithChildren({ diagram });
        },
        list: async (options: DiagramListOptions = {}): Promise<Diagram[]> => {
            const diagramRows = await db.diagrams.toArray();

            return await Promise.all(
                diagramRows.map((diagram) =>
                    attachIncludedChildren(diagram, options)
                )
            );
        },
        get: async (
            id: string,
            options: DiagramListOptions = {}
        ): Promise<Diagram | undefined> => {
            const diagram = await db.diagrams.get(id);

            if (!diagram) {
                return undefined;
            }

            return await attachIncludedChildren(diagram, options);
        },
        update: async ({
            id,
            attributes,
        }: {
            id: string;
            attributes: Partial<Diagram>;
        }) => {
            await db.diagrams.update(id, attributes);

            if (attributes.id) {
                await Promise.all([
                    tables.updateDiagramId(id, attributes.id),
                    relationships.updateDiagramId(id, attributes.id),
                    dependencies.updateDiagramId(id, attributes.id),
                    areas.updateDiagramId(id, attributes.id),
                    customTypes.updateDiagramId(id, attributes.id),
                    notes.updateDiagramId(id, attributes.id),
                ]);
            }
        },
        delete: async (id: string) => {
            await diagramTransactions.deleteDiagramWithChildren(id);
        },
    };

    return {
        config,
        diagramFilters,
        diagrams,
        tables,
        relationships,
        dependencies,
        areas,
        customTypes,
        notes,
    };
};

export type ChartDBRepositories = ReturnType<typeof createChartDBRepositories>;
