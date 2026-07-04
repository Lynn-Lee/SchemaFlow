import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ChartDBContext } from './chartdb-context';
import type { StorageContext } from '../storage-context/storage-context';
import type { RedoUndoStackContext } from '../history-context/redo-undo-stack-context';
import type { DBCheckConstraint } from '@/lib/domain/db-check-constraint';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { DatabaseType } from '@/lib/domain/database-type';
import { generateId } from '@/lib/utils';
import {
    applyCheckConstraintCommand,
    applyRelationshipCommand,
    createAddCheckConstraintCommand,
    createAddRelationshipCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createDeleteCheckConstraintCommand,
    createDeleteRelationshipCommand,
    createUpdateCheckConstraintCommand,
    createUpdateRelationshipCommand,
    type CommandContext,
    type CommandHistoryBatch,
    type CommandHistoryEntry,
    type CommandResult,
    type DiagramCommand,
    type DiagramFieldIndexRelationshipCommandState,
} from '@/schema-core/commands';

export interface UseRelationshipConstraintOperationsParams {
    addUndoAction: RedoUndoStackContext['addUndoAction'];
    commandContext: CommandContext;
    databaseType: DatabaseType;
    db: StorageContext;
    diagramId: string;
    getTable: (id: string) => DBTable | null;
    relationships: DBRelationship[];
    resetRedoStack: RedoUndoStackContext['resetRedoStack'];
    setDiagramUpdatedAt: Dispatch<SetStateAction<Date>>;
    setRelationships: Dispatch<SetStateAction<DBRelationship[]>>;
    setTables: Dispatch<SetStateAction<DBTable[]>>;
    tables: DBTable[];
}

export function useRelationshipConstraintOperations({
    addUndoAction,
    commandContext,
    databaseType,
    db,
    diagramId,
    getTable,
    relationships,
    resetRedoStack,
    setDiagramUpdatedAt,
    setRelationships,
    setTables,
    tables,
}: UseRelationshipConstraintOperationsParams): Pick<
    ChartDBContext,
    | 'addCheckConstraint'
    | 'createCheckConstraint'
    | 'removeCheckConstraint'
    | 'updateCheckConstraint'
    | 'addRelationship'
    | 'addRelationships'
    | 'createRelationship'
    | 'getRelationship'
    | 'removeRelationship'
    | 'removeRelationships'
    | 'updateRelationship'
> {
    const addCheckConstraint: ChartDBContext['addCheckConstraint'] =
        useCallback(
            async (
                tableId: string,
                constraint: DBCheckConstraint,
                options = { updateHistory: true }
            ) => {
                const command = createAddCheckConstraintCommand({
                    context: commandContext,
                    tableId,
                    constraint,
                });
                const result = applyCheckConstraintCommand({
                    context: commandContext,
                    state: createCommandState({
                        databaseType,
                        tables,
                        relationships,
                    }),
                    command,
                });
                if (result.status !== 'success') {
                    return;
                }

                setTables(result.state.tables);

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
                    return;
                }
                const updatedTable = result.state.tables.find(
                    (table) => table.id === tableId
                );
                if (!updatedTable) {
                    return;
                }

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                    db.updateTable({
                        id: tableId,
                        attributes: { ...dbTable, ...updatedTable },
                    }),
                ]);

                if (options.updateHistory) {
                    addUndoAction({
                        action: 'addCheckConstraint',
                        redoData: { tableId, constraint },
                        undoData: { tableId, constraintId: constraint.id },
                        commandHistory: createSingleCommandHistory(
                            command,
                            result
                        ),
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                diagramId,
                setTables,
                setDiagramUpdatedAt,
                addUndoAction,
                resetRedoStack,
                tables,
                relationships,
                databaseType,
                commandContext,
            ]
        );

    const createCheckConstraint: ChartDBContext['createCheckConstraint'] =
        useCallback(
            async (tableId: string) => {
                const constraint: DBCheckConstraint = {
                    id: generateId(),
                    expression: '',
                    createdAt: Date.now(),
                };

                await addCheckConstraint(tableId, constraint);

                return constraint;
            },
            [addCheckConstraint]
        );

    const removeCheckConstraint: ChartDBContext['removeCheckConstraint'] =
        useCallback(
            async (
                tableId: string,
                constraintId: string,
                options = { updateHistory: true }
            ) => {
                const table = getTable(tableId);
                const prevConstraint = table?.checkConstraints?.find(
                    (c) => c.id === constraintId
                );
                const command = createDeleteCheckConstraintCommand({
                    context: commandContext,
                    tableId,
                    constraintId,
                });
                const result = applyCheckConstraintCommand({
                    context: commandContext,
                    state: createCommandState({
                        databaseType,
                        tables,
                        relationships,
                    }),
                    command,
                });
                if (result.status !== 'success') {
                    return;
                }

                setTables(result.state.tables);

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
                    return;
                }
                const updatedTable = result.state.tables.find(
                    (currentTable) => currentTable.id === tableId
                );
                if (!updatedTable) {
                    return;
                }

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                    db.updateTable({
                        id: tableId,
                        attributes: { ...dbTable, ...updatedTable },
                    }),
                ]);

                if (!!prevConstraint && options.updateHistory) {
                    addUndoAction({
                        action: 'removeCheckConstraint',
                        redoData: { tableId, constraintId },
                        undoData: { tableId, constraint: prevConstraint },
                        commandHistory: createSingleCommandHistory(
                            command,
                            result
                        ),
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                diagramId,
                setTables,
                setDiagramUpdatedAt,
                addUndoAction,
                resetRedoStack,
                getTable,
                tables,
                relationships,
                databaseType,
                commandContext,
            ]
        );

    const updateCheckConstraint: ChartDBContext['updateCheckConstraint'] =
        useCallback(
            async (
                tableId: string,
                constraintId: string,
                constraint: Partial<DBCheckConstraint>,
                options = { updateHistory: true }
            ) => {
                const table = getTable(tableId);
                const prevConstraint = table?.checkConstraints?.find(
                    (c) => c.id === constraintId
                );
                const command = createUpdateCheckConstraintCommand({
                    context: commandContext,
                    tableId,
                    constraintId,
                    constraint,
                });
                const result = applyCheckConstraintCommand({
                    context: commandContext,
                    state: createCommandState({
                        databaseType,
                        tables,
                        relationships,
                    }),
                    command,
                });
                if (result.status !== 'success') {
                    return;
                }

                setTables(result.state.tables);

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
                    return;
                }
                const updatedTable = result.state.tables.find(
                    (currentTable) => currentTable.id === tableId
                );
                if (!updatedTable) {
                    return;
                }

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                    db.updateTable({
                        id: tableId,
                        attributes: { ...dbTable, ...updatedTable },
                    }),
                ]);

                if (!!prevConstraint && options.updateHistory) {
                    addUndoAction({
                        action: 'updateCheckConstraint',
                        redoData: { tableId, constraintId, constraint },
                        undoData: {
                            tableId,
                            constraintId,
                            constraint: prevConstraint,
                        },
                        commandHistory: createSingleCommandHistory(
                            command,
                            result
                        ),
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                diagramId,
                setTables,
                setDiagramUpdatedAt,
                addUndoAction,
                resetRedoStack,
                getTable,
                tables,
                relationships,
                databaseType,
                commandContext,
            ]
        );

    const addRelationships: ChartDBContext['addRelationships'] = useCallback(
        async (
            relationshipsToAdd: DBRelationship[],
            options = { updateHistory: true }
        ) => {
            const initialCommandState: DiagramFieldIndexRelationshipCommandState =
                {
                    databaseType,
                    tables,
                    relationships,
                };
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            const nextCommandState =
                relationshipsToAdd.reduce<DiagramFieldIndexRelationshipCommandState>(
                    (state, relationship) => {
                        const command = createAddRelationshipCommand({
                            context: commandContext,
                            relationship,
                        });
                        const result = applyRelationshipCommand({
                            context: commandContext,
                            state,
                            command,
                        });
                        commandHistoryEntries.push(
                            createCommandHistoryEntry({
                                redoCommand: command,
                                result,
                            })
                        );
                        return result.status === 'success'
                            ? result.state
                            : state;
                    },
                    initialCommandState
                );
            const existingRelationshipIds = new Set(
                relationships.map((relationship) => relationship.id)
            );
            const acceptedRelationships = relationshipsToAdd.filter(
                (relationship) =>
                    !existingRelationshipIds.has(relationship.id) &&
                    nextCommandState.relationships.some(
                        (acceptedRelationship) =>
                            acceptedRelationship.id === relationship.id
                    )
            );
            if (acceptedRelationships.length === 0) {
                return;
            }

            setRelationships(nextCommandState.relationships);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...acceptedRelationships.map((relationship) =>
                    db.addRelationship({ diagramId, relationship })
                ),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addRelationships',
                    redoData: { relationships: acceptedRelationships },
                    undoData: {
                        relationshipIds: acceptedRelationships.map((r) => r.id),
                    },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setRelationships,
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
            tables,
            relationships,
            databaseType,
            commandContext,
        ]
    );

    const addRelationship: ChartDBContext['addRelationship'] = useCallback(
        async (
            relationship: DBRelationship,
            options = { updateHistory: true }
        ) => {
            return addRelationships([relationship], options);
        },
        [addRelationships]
    );

    const createRelationship: ChartDBContext['createRelationship'] =
        useCallback(
            async ({
                sourceTableId,
                targetTableId,
                sourceFieldId,
                targetFieldId,
            }) => {
                const sourceTable = getTable(sourceTableId);
                const sourceTableName = sourceTable?.name ?? '';

                const sourceField = sourceTable?.fields.find(
                    (field: { id: string }) => field.id === sourceFieldId
                );

                const sourceFieldName = sourceField?.name ?? '';

                const targetTable = getTable(targetTableId);
                const targetTableSchema = targetTable?.schema;

                const relationship: DBRelationship = {
                    id: generateId(),
                    name: `${sourceTableName}_${sourceFieldName}_fk`,
                    sourceSchema: sourceTable?.schema,
                    sourceTableId,
                    targetSchema: targetTableSchema,
                    targetTableId,
                    sourceFieldId,
                    targetFieldId,
                    sourceCardinality: 'one',
                    targetCardinality: 'one',
                    createdAt: Date.now(),
                };

                await addRelationship(relationship);

                return relationship;
            },
            [addRelationship, getTable]
        );

    const getRelationship: ChartDBContext['getRelationship'] = useCallback(
        (id: string) =>
            relationships.find((relationship) => relationship.id === id) ??
            null,
        [relationships]
    );

    const removeRelationships: ChartDBContext['removeRelationships'] =
        useCallback(
            async (ids: string[], options = { updateHistory: true }) => {
                const prevRelationships = [
                    ...relationships.filter((relationship) =>
                        ids.includes(relationship.id)
                    ),
                ];
                const initialCommandState: DiagramFieldIndexRelationshipCommandState =
                    {
                        databaseType,
                        tables,
                        relationships,
                    };
                const commandHistoryEntries: Array<CommandHistoryEntry | null> =
                    [];
                const nextCommandState =
                    ids.reduce<DiagramFieldIndexRelationshipCommandState>(
                        (state, id) => {
                            const command = createDeleteRelationshipCommand({
                                context: commandContext,
                                relationshipId: id,
                            });
                            const result = applyRelationshipCommand({
                                context: commandContext,
                                state,
                                command,
                            });
                            commandHistoryEntries.push(
                                createCommandHistoryEntry({
                                    redoCommand: command,
                                    result,
                                })
                            );
                            return result.status === 'success'
                                ? result.state
                                : state;
                        },
                        initialCommandState
                    );

                setRelationships(nextCommandState.relationships);

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    ...ids.map((id) =>
                        db.deleteRelationship({ diagramId, id })
                    ),
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                ]);

                if (prevRelationships.length > 0 && options.updateHistory) {
                    addUndoAction({
                        action: 'removeRelationships',
                        redoData: { relationshipsIds: ids },
                        undoData: { relationships: prevRelationships },
                        commandHistory: createBatchedCommandHistory(
                            commandHistoryEntries
                        ),
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                diagramId,
                setRelationships,
                setDiagramUpdatedAt,
                relationships,
                addUndoAction,
                resetRedoStack,
                tables,
                databaseType,
                commandContext,
            ]
        );

    const removeRelationship: ChartDBContext['removeRelationship'] =
        useCallback(
            async (id: string, options = { updateHistory: true }) => {
                return removeRelationships([id], options);
            },
            [removeRelationships]
        );

    const updateRelationship: ChartDBContext['updateRelationship'] =
        useCallback(
            async (
                id: string,
                relationship: Partial<DBRelationship>,
                options = { updateHistory: true }
            ) => {
                const prevRelationship = getRelationship(id);
                const command = createUpdateRelationshipCommand({
                    context: commandContext,
                    relationshipId: id,
                    relationship,
                });
                const result = applyRelationshipCommand({
                    context: commandContext,
                    state: {
                        databaseType,
                        tables,
                        relationships,
                    } satisfies DiagramFieldIndexRelationshipCommandState,
                    command,
                });
                if (result.status !== 'success') {
                    return;
                }

                setRelationships(result.state.relationships);

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                await Promise.all([
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
                    db.updateRelationship({ id, attributes: relationship }),
                ]);

                if (!!prevRelationship && options.updateHistory) {
                    addUndoAction({
                        action: 'updateRelationship',
                        redoData: { relationshipId: id, relationship },
                        undoData: {
                            relationshipId: id,
                            relationship: prevRelationship,
                        },
                        commandHistory: createSingleCommandHistory(
                            command,
                            result
                        ),
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                setRelationships,
                setDiagramUpdatedAt,
                addUndoAction,
                getRelationship,
                resetRedoStack,
                diagramId,
                tables,
                relationships,
                databaseType,
                commandContext,
            ]
        );

    return {
        addCheckConstraint,
        createCheckConstraint,
        removeCheckConstraint,
        updateCheckConstraint,
        addRelationship,
        addRelationships,
        createRelationship,
        getRelationship,
        removeRelationship,
        removeRelationships,
        updateRelationship,
    };
}

function createSingleCommandHistory<TState>(
    redoCommand: DiagramCommand,
    result: CommandResult<TState>
): CommandHistoryBatch | undefined {
    return createCommandHistoryBatch([
        createCommandHistoryEntry({ redoCommand, result }),
    ]);
}

function createBatchedCommandHistory(
    entries: Array<CommandHistoryEntry | null>
): CommandHistoryBatch | undefined {
    return createCommandHistoryBatch(entries);
}

function createCommandState({
    databaseType,
    tables,
    relationships,
}: {
    databaseType: DatabaseType;
    tables: DBTable[];
    relationships: DBRelationship[];
}): DiagramFieldIndexRelationshipCommandState {
    return {
        databaseType,
        tables,
        relationships,
    };
}
