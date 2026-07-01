import type { Area } from '@/lib/domain/area';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Diagram } from '@/lib/domain/diagram';
import type { ChartDBDexie } from '@/storage/db/chartdb-dexie';

const getDiagramCore = (diagram: Diagram): Diagram => ({
    id: diagram.id,
    name: diagram.name,
    databaseType: diagram.databaseType,
    databaseEdition: diagram.databaseEdition,
    createdAt: diagram.createdAt,
    updatedAt: diagram.updatedAt,
});

const withDiagramId = <T extends { id: string }>(
    diagramId: string,
    item: T
): T & { diagramId: string } => ({
    ...item,
    diagramId,
});

export const createDiagramTransactionService = (db: ChartDBDexie) => {
    const runDiagramTransaction = async (callback: () => Promise<void>) => {
        await db.transaction(
            'rw',
            [
                db.diagrams,
                db.db_tables,
                db.db_relationships,
                db.db_dependencies,
                db.areas,
                db.db_custom_types,
                db.notes,
                db.diagram_filters,
            ],
            callback
        );
    };

    const deleteDiagramChildren = async (diagramId: string) => {
        await db.db_tables.where('diagramId').equals(diagramId).delete();
        await db.db_relationships.where('diagramId').equals(diagramId).delete();
        await db.db_dependencies.where('diagramId').equals(diagramId).delete();
        await db.areas.where('diagramId').equals(diagramId).delete();
        await db.db_custom_types.where('diagramId').equals(diagramId).delete();
        await db.notes.where('diagramId').equals(diagramId).delete();
        await db.diagram_filters.where({ diagramId }).delete();
    };

    const addDiagramRows = async (diagram: Diagram) => {
        await db.diagrams.add(getDiagramCore(diagram));

        for (const table of diagram.tables ?? []) {
            await db.db_tables.add(withDiagramId<DBTable>(diagram.id, table));
        }

        for (const relationship of diagram.relationships ?? []) {
            await db.db_relationships.add(
                withDiagramId<DBRelationship>(diagram.id, relationship)
            );
        }

        for (const dependency of diagram.dependencies ?? []) {
            await db.db_dependencies.add(
                withDiagramId<DBDependency>(diagram.id, dependency)
            );
        }

        for (const area of diagram.areas ?? []) {
            await db.areas.add(withDiagramId<Area>(diagram.id, area));
        }

        for (const customType of diagram.customTypes ?? []) {
            await db.db_custom_types.add(
                withDiagramId<DBCustomType>(diagram.id, customType)
            );
        }

        for (const note of diagram.notes ?? []) {
            await db.notes.add(withDiagramId(diagram.id, note));
        }
    };

    return {
        addDiagramWithChildren: async ({ diagram }: { diagram: Diagram }) => {
            await runDiagramTransaction(async () => {
                await addDiagramRows(diagram);
            });
        },
        deleteDiagramWithChildren: async (diagramId: string) => {
            await runDiagramTransaction(async () => {
                await db.diagrams.delete(diagramId);
                await deleteDiagramChildren(diagramId);
            });
        },
        replaceDiagramData: async ({ diagram }: { diagram: Diagram }) => {
            await runDiagramTransaction(async () => {
                await db.diagrams.delete(diagram.id);
                await deleteDiagramChildren(diagram.id);
                await addDiagramRows(diagram);
            });
        },
    };
};

export type DiagramTransactionService = ReturnType<
    typeof createDiagramTransactionService
>;
