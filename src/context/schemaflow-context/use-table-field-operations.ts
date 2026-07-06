import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import type { SchemaFlowContext, SchemaFlowEvent } from './schemaflow-context';
import type { StorageContext } from '../storage-context/storage-context';
import type { RedoUndoStackContext } from '../history-context/redo-undo-stack-context';
import { dbTableSchema, type DBTable } from '@/lib/domain/db-table';
import type { DBField } from '@/lib/domain/db-field';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { Note } from '@/lib/domain/note';
import type { DatabaseType } from '@/lib/domain/database-type';
import { defaultSchemas } from '@/lib/data/default-schemas';
import { getDefaultPrimaryKeyType } from '@/lib/data/data-types/data-types';
import { getTableIndexesWithPrimaryKey } from '@/lib/domain/db-index';
import { defaultTableColor, viewColor } from '@/lib/colors';
import { deepCopy, generateId } from '@/lib/utils';
import type { EventEmitter } from 'ahooks/lib/useEventEmitter';
import {
    applyFieldCommand,
    applyTableCommand,
    createAddFieldCommand,
    createAddTableCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createDeleteFieldCommand,
    createDeleteTableCommand,
    createUpdateFieldCommand,
    createUpdateTableCommand,
    type CommandContext,
    type CommandHistoryBatch,
    type CommandHistoryEntry,
    type CommandResult,
    type DiagramCommand,
    type DiagramFieldIndexRelationshipCommandState,
    type DiagramTableCommandState,
    type RestoreFieldCommand,
    type RestoreTableCommand,
    type UpdateTableCommand,
} from '@/schema-core/commands';

export interface UseTableFieldOperationsParams {
    addUndoAction: RedoUndoStackContext['addUndoAction'];
    commandContext: CommandContext;
    databaseType: DatabaseType;
    db: StorageContext;
    dependencies: DBDependency[];
    diagramId: string;
    events: EventEmitter<SchemaFlowEvent>;
    notes: Note[];
    relationships: DBRelationship[];
    resetRedoStack: RedoUndoStackContext['resetRedoStack'];
    setDependencies: Dispatch<SetStateAction<DBDependency[]>>;
    setDiagramUpdatedAt: Dispatch<SetStateAction<Date>>;
    setRelationships: Dispatch<SetStateAction<DBRelationship[]>>;
    setTables: Dispatch<SetStateAction<DBTable[]>>;
    tables: DBTable[];
}

export function useTableFieldOperations({
    addUndoAction,
    commandContext,
    databaseType,
    db,
    dependencies,
    diagramId,
    events,
    notes,
    relationships,
    resetRedoStack,
    setDependencies,
    setDiagramUpdatedAt,
    setRelationships,
    setTables,
    tables,
}: UseTableFieldOperationsParams): Pick<
    SchemaFlowContext,
    | 'addTable'
    | 'addTables'
    | 'createTable'
    | 'getTable'
    | 'removeTable'
    | 'removeTables'
    | 'updateTable'
    | 'updateTablesState'
    | 'addField'
    | 'createField'
    | 'getField'
    | 'removeField'
    | 'updateField'
> {
    const addTables: SchemaFlowContext['addTables'] = useCallback(
        async (tablesToAdd: DBTable[], options = { updateHistory: true }) => {
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            const nextCommandState = tablesToAdd.reduce(
                (state, table) => {
                    const command = createAddTableCommand({
                        context: commandContext,
                        table,
                    });
                    const result = applyTableCommand({
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
                    return result.status === 'success' ? result.state : state;
                },
                {
                    tables,
                    relationships,
                    dependencies,
                    notes,
                } satisfies DiagramTableCommandState
            );

            setTables(nextCommandState.tables);
            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                ...tablesToAdd.map((table) =>
                    db.addTable({ diagramId, table })
                ),
            ]);

            events.emit({
                action: 'add_tables',
                data: { tables: tablesToAdd },
            });

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addTables',
                    redoData: { tables: tablesToAdd },
                    undoData: { tableIds: tablesToAdd.map((t) => t.id) },
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
            setTables,
            addUndoAction,
            resetRedoStack,
            events,
            setDiagramUpdatedAt,
            tables,
            relationships,
            dependencies,
            notes,
            commandContext,
        ]
    );

    const addTable: SchemaFlowContext['addTable'] = useCallback(
        async (table: DBTable, options = { updateHistory: true }) => {
            return addTables([table], options);
        },
        [addTables]
    );

    const createTable: SchemaFlowContext['createTable'] = useCallback(
        async (attributes) => {
            const isView = attributes?.isView ?? false;
            const count = isView
                ? tables.filter((t) => t.isView).length + 1
                : tables.filter((t) => !t.isView).length + 1;
            const table: DBTable = {
                id: generateId(),
                name: isView ? `view_${count}` : `table_${count}`,
                x: 0,
                y: 0,
                fields: [
                    {
                        id: generateId(),
                        name: 'id',
                        type: getDefaultPrimaryKeyType(databaseType),
                        unique: true,
                        nullable: false,
                        primaryKey: true,
                        createdAt: Date.now(),
                    },
                ],
                indexes: [],
                color: attributes?.isView ? viewColor : defaultTableColor,
                createdAt: Date.now(),
                isView: false,
                order: tables.length,
                ...attributes,
                schema: attributes?.schema ?? defaultSchemas[databaseType],
            };

            table.indexes = getTableIndexesWithPrimaryKey({
                table,
            });

            await addTable(table);

            return table;
        },
        [addTable, tables, databaseType]
    );

    const getTable: SchemaFlowContext['getTable'] = useCallback(
        (id: string) => tables.find((table) => table.id === id) ?? null,
        [tables]
    );

    const removeTables: SchemaFlowContext['removeTables'] = useCallback(
        async (ids, options) => {
            const initialCommandState = {
                tables,
                relationships,
                dependencies,
                notes,
            } satisfies DiagramTableCommandState;
            const commandResults = ids.map((id) => {
                const command = createDeleteTableCommand({
                    context: commandContext,
                    tableId: id,
                });
                const result = applyTableCommand({
                    context: commandContext,
                    state: initialCommandState,
                    command,
                });
                return { command, result };
            });
            const tablesToRemove = commandResults.flatMap((result) =>
                result.result.status === 'success' &&
                isRestoreTableCommand(result.result.undoCommand)
                    ? [result.result.undoCommand.payload.table]
                    : []
            );
            const relationshipsToRemove = uniqueById(
                commandResults.flatMap((result) =>
                    result.result.status === 'success' &&
                    isRestoreTableCommand(result.result.undoCommand)
                        ? result.result.undoCommand.payload.relationships
                        : []
                )
            );
            const dependenciesToRemove = uniqueById(
                commandResults.flatMap((result) =>
                    result.result.status === 'success' &&
                    isRestoreTableCommand(result.result.undoCommand)
                        ? result.result.undoCommand.payload.dependencies
                        : []
                )
            );
            const nextCommandState = ids.reduce((state, id) => {
                const result = applyTableCommand({
                    context: commandContext,
                    state,
                    command: createDeleteTableCommand({
                        context: commandContext,
                        tableId: id,
                    }),
                });
                return result.status === 'success' ? result.state : state;
            }, initialCommandState);

            setRelationships(nextCommandState.relationships);
            setDependencies(nextCommandState.dependencies);
            setTables(nextCommandState.tables);

            events.emit({ action: 'remove_tables', data: { tableIds: ids } });

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                ...relationshipsToRemove.map((relationship) =>
                    db.deleteRelationship({ diagramId, id: relationship.id })
                ),
                ...dependenciesToRemove.map((dependency) =>
                    db.deleteDependency({ diagramId, id: dependency.id })
                ),
                ...ids.map((id) => db.deleteTable({ diagramId, id })),
            ]);

            if (tablesToRemove.length > 0 && options?.updateHistory) {
                addUndoAction({
                    action: 'removeTables',
                    redoData: {
                        tableIds: ids,
                    },
                    undoData: {
                        tables: tablesToRemove,
                        relationships: relationshipsToRemove,
                        dependencies: dependenciesToRemove,
                    },
                    commandHistory: createBatchedCommandHistory(
                        commandResults.map(({ command, result }) =>
                            createCommandHistoryEntry({
                                redoCommand: command,
                                result,
                            })
                        )
                    ),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            relationships,
            events,
            setDependencies,
            setDiagramUpdatedAt,
            setRelationships,
            dependencies,
            tables,
            notes,
            commandContext,
        ]
    );

    const removeTable: SchemaFlowContext['removeTable'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeTables([id], options);
        },
        [removeTables]
    );

    const updateTable: SchemaFlowContext['updateTable'] = useCallback(
        async (
            id: string,
            table: Partial<DBTable>,
            options = { updateHistory: true }
        ) => {
            const command = createUpdateTableCommand({
                context: commandContext,
                tableId: id,
                table,
            });
            const commandResult = applyTableCommand({
                context: commandContext,
                state: {
                    tables,
                    relationships,
                    dependencies,
                    notes,
                },
                command,
            });
            const prevTable =
                commandResult.status === 'success' &&
                isUpdateTableCommand(commandResult.undoCommand)
                    ? commandResult.undoCommand.payload.table
                    : null;

            if (commandResult.status !== 'success') {
                return;
            }

            setTables(commandResult.state.tables);

            events.emit({
                action: 'update_table',
                data: { id, table },
            });

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({ id, attributes: table }),
            ]);

            if (!!prevTable && options.updateHistory) {
                addUndoAction({
                    action: 'updateTable',
                    redoData: { tableId: id, table },
                    undoData: { tableId: id, table: prevTable },
                    commandHistory: createSingleCommandHistory(
                        command,
                        commandResult
                    ),
                });
                resetRedoStack();
            }
        },
        [
            db,
            setTables,
            addUndoAction,
            resetRedoStack,
            diagramId,
            events,
            tables,
            relationships,
            dependencies,
            notes,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    const updateTablesState: SchemaFlowContext['updateTablesState'] =
        useCallback(
            async (
                updateFn: (tables: DBTable[]) => PartialExcept<DBTable, 'id'>[],
                options = { updateHistory: true, forceOverride: false }
            ) => {
                const updateTables = (prevTables: DBTable[]) => {
                    const updatedTables = updateFn(prevTables);
                    if (options.forceOverride) {
                        const parsedTables = z
                            .array(dbTableSchema)
                            .safeParse(updatedTables);
                        if (!parsedTables.success) {
                            throw new Error(
                                `updateTablesState forceOverride received an invalid tables snapshot: ${parsedTables.error.message}`
                            );
                        }
                        return parsedTables.data;
                    }

                    return prevTables
                        .map((prevTable) => {
                            const updatedTable = updatedTables.find(
                                (t) => t.id === prevTable.id
                            );
                            return updatedTable
                                ? { ...prevTable, ...updatedTable }
                                : prevTable;
                        })
                        .filter((prevTable) =>
                            updatedTables.some((t) => t.id === prevTable.id)
                        );
                };

                const prevTables = deepCopy(tables);
                const updatedTables = updateTables(tables);

                const tablesToDelete = prevTables.filter(
                    (table) => !updatedTables.some((t) => t.id === table.id)
                );

                const relationshipsToRemove = relationships.filter(
                    (relationship) =>
                        tablesToDelete.some(
                            (table) =>
                                table.id === relationship.sourceTableId ||
                                table.id === relationship.targetTableId
                        )
                );

                const dependenciesToRemove = dependencies.filter((dependency) =>
                    tablesToDelete.some(
                        (table) =>
                            table.id === dependency.tableId ||
                            table.id === dependency.dependentTableId
                    )
                );

                setRelationships((relationships) =>
                    relationships.filter(
                        (relationship) =>
                            !relationshipsToRemove.some(
                                (r) => r.id === relationship.id
                            )
                    )
                );

                setDependencies((dependencies) =>
                    dependencies.filter(
                        (dependency) =>
                            !dependenciesToRemove.some(
                                (d) => d.id === dependency.id
                            )
                    )
                );

                setTables(updateTables);

                events.emit({
                    action: 'remove_tables',
                    data: { tableIds: tablesToDelete.map((t) => t.id) },
                });

                const promises = [];
                for (const updatedTable of updatedTables) {
                    promises.push(
                        db.putTable({
                            diagramId,
                            table: updatedTable,
                        })
                    );
                }

                for (const table of tablesToDelete) {
                    promises.push(db.deleteTable({ diagramId, id: table.id }));
                }

                for (const relationship of relationshipsToRemove) {
                    promises.push(
                        db.deleteRelationship({
                            diagramId,
                            id: relationship.id,
                        })
                    );
                }

                for (const dependency of dependenciesToRemove) {
                    promises.push(
                        db.deleteDependency({ diagramId, id: dependency.id })
                    );
                }

                const updatedAt = new Date();
                setDiagramUpdatedAt(updatedAt);
                promises.push(
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    })
                );

                await Promise.all(promises);

                if (options.updateHistory) {
                    addUndoAction({
                        action: 'updateTablesState',
                        redoData: { tables: updatedTables },
                        undoData: {
                            tables: prevTables,
                            relationships: relationshipsToRemove,
                            dependencies: dependenciesToRemove,
                        },
                    });
                    resetRedoStack();
                }
            },
            [
                db,
                tables,
                setTables,
                diagramId,
                addUndoAction,
                resetRedoStack,
                relationships,
                events,
                dependencies,
                setDependencies,
                setDiagramUpdatedAt,
                setRelationships,
            ]
        );

    const getField: SchemaFlowContext['getField'] = useCallback(
        (tableId: string, fieldId: string) => {
            const table = getTable(tableId);
            return table?.fields.find((f) => f.id === fieldId) ?? null;
        },
        [getTable]
    );

    const updateField: SchemaFlowContext['updateField'] = useCallback(
        async (
            tableId: string,
            fieldId: string,
            field: Partial<DBField>,
            options = { updateHistory: true }
        ) => {
            const prevField = getField(tableId, fieldId);
            const command = createUpdateFieldCommand({
                context: commandContext,
                tableId,
                fieldId,
                field,
            });
            const result = applyFieldCommand({
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

            setTables(result.state.tables);

            const table = await db.getTable({ diagramId, id: tableId });
            if (!table) {
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (!!prevField && options.updateHistory) {
                addUndoAction({
                    action: 'updateField',
                    redoData: {
                        tableId,
                        fieldId,
                        field: { ...prevField, ...field },
                    },
                    undoData: { tableId, fieldId, field: prevField },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            getField,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    const removeField: SchemaFlowContext['removeField'] = useCallback(
        async (
            tableId: string,
            fieldId: string,
            options = { updateHistory: true }
        ) => {
            const fields = getTable(tableId)?.fields ?? [];
            const prevField = getField(tableId, fieldId);
            const command = createDeleteFieldCommand({
                context: commandContext,
                tableId,
                fieldId,
            });
            const result = applyFieldCommand({
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
            const relationshipsToRemove = isRestoreFieldCommand(
                result.undoCommand
            )
                ? result.undoCommand.payload.relationships
                : [];

            setTables(result.state.tables);
            setRelationships(result.state.relationships);

            events.emit({
                action: 'remove_field',
                data: {
                    tableId: tableId,
                    fieldId,
                    fields: fields.filter((f) => f.id !== fieldId),
                },
            });

            const table = await db.getTable({ diagramId, id: tableId });
            if (!table) {
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
                ...relationshipsToRemove.map((relationship) =>
                    db.deleteRelationship({ diagramId, id: relationship.id })
                ),
            ]);

            if (!!prevField && options.updateHistory) {
                addUndoAction({
                    action: 'removeField',
                    redoData: { tableId, fieldId },
                    undoData: {
                        tableId,
                        field: prevField,
                        relationships: relationshipsToRemove,
                    },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            getField,
            getTable,
            events,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
            setRelationships,
        ]
    );

    const addField: SchemaFlowContext['addField'] = useCallback(
        async (
            tableId: string,
            field: DBField,
            options = { updateHistory: true }
        ) => {
            const fields = getTable(tableId)?.fields ?? [];
            const command = createAddFieldCommand({
                context: commandContext,
                tableId,
                field,
            });
            const result = applyFieldCommand({
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

            setTables(result.state.tables);

            events.emit({
                action: 'add_field',
                data: {
                    tableId: tableId,
                    field,
                    fields: [...fields, field],
                },
            });

            const table = await db.getTable({ diagramId, id: tableId });

            if (!table) {
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addField',
                    redoData: { tableId, field },
                    undoData: { tableId, fieldId: field.id },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            events,
            getTable,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    const createField: SchemaFlowContext['createField'] = useCallback(
        async (tableId: string) => {
            const table = getTable(tableId);
            const field: DBField = {
                id: generateId(),
                name: `field_${(table?.fields?.length ?? 0) + 1}`,
                type: getDefaultPrimaryKeyType(databaseType),
                unique: false,
                nullable: true,
                primaryKey: false,
                createdAt: Date.now(),
            };

            await addField(tableId, field);

            return field;
        },
        [addField, getTable, databaseType]
    );

    return {
        addField,
        addTable,
        addTables,
        createField,
        createTable,
        getField,
        getTable,
        removeField,
        removeTable,
        removeTables,
        updateField,
        updateTable,
        updateTablesState,
    };
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
    return [...new Map(items.map((item) => [item.id, item])).values()];
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

function isRestoreTableCommand(
    command: unknown
): command is RestoreTableCommand {
    return (command as { type?: string } | undefined)?.type === 'table.restore';
}

function isRestoreFieldCommand(
    command: unknown
): command is RestoreFieldCommand {
    return (command as { type?: string } | undefined)?.type === 'field.restore';
}

function isUpdateTableCommand(command: unknown): command is UpdateTableCommand {
    return (command as { type?: string } | undefined)?.type === 'table.update';
}
