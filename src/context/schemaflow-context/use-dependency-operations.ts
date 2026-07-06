import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SchemaFlowContext } from './schemaflow-context';
import type { StorageContext } from '../storage-context/storage-context';
import type { RedoUndoStackContext } from '../history-context/redo-undo-stack-context';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBTable } from '@/lib/domain/db-table';
import { generateId } from '@/lib/utils';

export interface UseDependencyOperationsParams {
    addUndoAction: RedoUndoStackContext['addUndoAction'];
    db: StorageContext;
    dependencies: DBDependency[];
    diagramId: string;
    getTable: (id: string) => DBTable | null;
    resetRedoStack: RedoUndoStackContext['resetRedoStack'];
    setDependencies: Dispatch<SetStateAction<DBDependency[]>>;
    setDiagramUpdatedAt: Dispatch<SetStateAction<Date>>;
}

export function useDependencyOperations({
    addUndoAction,
    db,
    dependencies,
    diagramId,
    getTable,
    resetRedoStack,
    setDependencies,
    setDiagramUpdatedAt,
}: UseDependencyOperationsParams): Pick<
    SchemaFlowContext,
    | 'addDependency'
    | 'addDependencies'
    | 'createDependency'
    | 'getDependency'
    | 'removeDependency'
    | 'removeDependencies'
    | 'updateDependency'
> {
    const addDependencies: SchemaFlowContext['addDependencies'] = useCallback(
        async (
            dependencies: DBDependency[],
            options = { updateHistory: true }
        ) => {
            setDependencies((currentDependencies) => [
                ...currentDependencies,
                ...dependencies,
            ]);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...dependencies.map((dependency) =>
                    db.addDependency({ diagramId, dependency })
                ),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addDependencies',
                    redoData: { dependencies },
                    undoData: {
                        dependenciesIds: dependencies.map((r) => r.id),
                    },
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setDependencies,
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addDependency: SchemaFlowContext['addDependency'] = useCallback(
        async (dependency: DBDependency, options = { updateHistory: true }) =>
            addDependencies([dependency], options),
        [addDependencies]
    );

    const createDependency: SchemaFlowContext['createDependency'] = useCallback(
        async ({ tableId, dependentTableId }) => {
            const table = getTable(tableId);
            const dependentTable = getTable(dependentTableId);

            const dependency: DBDependency = {
                id: generateId(),
                tableId,
                dependentTableId,
                dependentSchema: dependentTable?.schema,
                schema: table?.schema,
                createdAt: Date.now(),
            };

            await addDependency(dependency);

            return dependency;
        },
        [addDependency, getTable]
    );

    const getDependency: SchemaFlowContext['getDependency'] = useCallback(
        (id: string) =>
            dependencies.find((dependency) => dependency.id === id) ?? null,
        [dependencies]
    );

    const removeDependencies: SchemaFlowContext['removeDependencies'] =
        useCallback(
            async (ids: string[], options = { updateHistory: true }) => {
                const prevDependencies = [
                    ...dependencies.filter((dependency) =>
                        ids.includes(dependency.id)
                    ),
                ];

                setDependencies((dependencies) =>
                    dependencies.filter(
                        (dependency) => !ids.includes(dependency.id)
                    )
                );

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    ...ids.map((id) => db.deleteDependency({ diagramId, id })),
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                ]);

                if (prevDependencies.length > 0 && options.updateHistory) {
                    addUndoAction({
                        action: 'removeDependencies',
                        redoData: { dependenciesIds: ids },
                        undoData: { dependencies: prevDependencies },
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                diagramId,
                setDependencies,
                setDiagramUpdatedAt,
                addUndoAction,
                resetRedoStack,
                dependencies,
            ]
        );

    const removeDependency: SchemaFlowContext['removeDependency'] = useCallback(
        async (id: string, options = { updateHistory: true }) =>
            removeDependencies([id], options),
        [removeDependencies]
    );

    const updateDependency: SchemaFlowContext['updateDependency'] = useCallback(
        async (
            id: string,
            dependency: Partial<DBDependency>,
            options = { updateHistory: true }
        ) => {
            const prevDependency = getDependency(id);
            setDependencies((dependencies) =>
                dependencies.map((d) =>
                    d.id === id ? { ...d, ...dependency } : d
                )
            );

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateDependency({ id, attributes: dependency }),
            ]);

            if (!!prevDependency && options.updateHistory) {
                addUndoAction({
                    action: 'updateDependency',
                    redoData: { dependencyId: id, dependency },
                    undoData: { dependencyId: id, dependency: prevDependency },
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setDependencies,
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
            getDependency,
        ]
    );

    return {
        addDependency,
        addDependencies,
        createDependency,
        getDependency,
        removeDependency,
        removeDependencies,
        updateDependency,
    };
}
