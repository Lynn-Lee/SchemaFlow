import React, { useMemo } from 'react';
import type { StorageContext } from './storage-context';
import { storageContext } from './storage-context';
import { createSchemaFlowDexie } from '@/storage/db/schemaflow-dexie';
import { createSchemaFlowRepositories } from '@/storage/repositories/schemaflow-repositories';

export const StorageProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const database = useMemo(() => createSchemaFlowDexie(), []);
    const repositories = useMemo(
        () => createSchemaFlowRepositories(database),
        [database]
    );

    const value = useMemo<StorageContext>(
        () => ({
            getConfig: repositories.config.get,
            updateConfig: repositories.config.update,

            getDiagramFilter: repositories.diagramFilters.get,
            updateDiagramFilter: repositories.diagramFilters.update,
            deleteDiagramFilter: repositories.diagramFilters.delete,

            addDiagram: repositories.diagrams.add,
            listDiagrams: repositories.diagrams.list,
            getDiagram: repositories.diagrams.get,
            updateDiagram: repositories.diagrams.update,
            deleteDiagram: repositories.diagrams.delete,
            clearAllDiagrams: async () => {
                await repositories.diagrams.clearAll();
                await repositories.config.update({
                    defaultDiagramId: undefined,
                });
            },

            addTable: ({ diagramId, table }) =>
                repositories.tables.add({ diagramId, item: table }),
            getTable: repositories.tables.get,
            updateTable: repositories.tables.update,
            putTable: ({ diagramId, table }) =>
                repositories.tables.put({ diagramId, item: table }),
            deleteTable: repositories.tables.delete,
            listTables: repositories.tables.list,
            deleteDiagramTables: repositories.tables.deleteDiagramItems,

            addRelationship: ({ diagramId, relationship }) =>
                repositories.relationships.add({
                    diagramId,
                    item: relationship,
                }),
            getRelationship: repositories.relationships.get,
            updateRelationship: repositories.relationships.update,
            deleteRelationship: repositories.relationships.delete,
            listRelationships: repositories.relationships.list,
            deleteDiagramRelationships:
                repositories.relationships.deleteDiagramItems,

            addDependency: ({ diagramId, dependency }) =>
                repositories.dependencies.add({
                    diagramId,
                    item: dependency,
                }),
            getDependency: repositories.dependencies.get,
            updateDependency: repositories.dependencies.update,
            deleteDependency: repositories.dependencies.delete,
            listDependencies: repositories.dependencies.list,
            deleteDiagramDependencies:
                repositories.dependencies.deleteDiagramItems,

            addArea: ({ diagramId, area }) =>
                repositories.areas.add({ diagramId, item: area }),
            getArea: repositories.areas.get,
            updateArea: repositories.areas.update,
            deleteArea: repositories.areas.delete,
            listAreas: repositories.areas.list,
            deleteDiagramAreas: repositories.areas.deleteDiagramItems,

            addCustomType: ({ diagramId, customType }) =>
                repositories.customTypes.add({
                    diagramId,
                    item: customType,
                }),
            getCustomType: repositories.customTypes.get,
            updateCustomType: repositories.customTypes.update,
            deleteCustomType: repositories.customTypes.delete,
            listCustomTypes: repositories.customTypes.list,
            deleteDiagramCustomTypes:
                repositories.customTypes.deleteDiagramItems,

            addNote: ({ diagramId, note }) =>
                repositories.notes.add({ diagramId, item: note }),
            getNote: repositories.notes.get,
            updateNote: repositories.notes.update,
            deleteNote: repositories.notes.delete,
            listNotes: repositories.notes.list,
            deleteDiagramNotes: repositories.notes.deleteDiagramItems,
        }),
        [repositories]
    );

    return (
        <storageContext.Provider value={value}>
            {children}
        </storageContext.Provider>
    );
};
