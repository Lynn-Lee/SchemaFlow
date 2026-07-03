import { useCallback, useMemo, useState } from 'react';
import type { DBTable } from '@/lib/domain/db-table';
import { deepCopy, generateId } from '@/lib/utils';
import { defaultTableColor, randomColor, viewColor } from '@/lib/colors';
import type { ChartDBContext, ChartDBEvent } from './chartdb-context';
import { useDependencyOperations } from './use-dependency-operations';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBField } from '@/lib/domain/db-field';
import {
    getTableIndexesWithPrimaryKey,
    type DBIndex,
} from '@/lib/domain/db-index';
import type { DBCheckConstraint } from '@/lib/domain/db-check-constraint';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import { useStorage } from '@/hooks/use-storage';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import type { Diagram } from '@/lib/domain/diagram';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import type { DBSchema } from '@/lib/domain/db-schema';
import {
    databasesWithSchemas,
    schemaNameToSchemaId,
} from '@/lib/domain/db-schema';
import { defaultSchemas } from '@/lib/data/default-schemas';
import { useEventEmitter } from 'ahooks';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { Area } from '@/lib/domain/area';
import type { Note } from '@/lib/domain/note';
import { storageInitialValue } from '../storage-context/storage-context';
import { useDiff } from '../diff-context/use-diff';
import type { DiffCalculatedEvent } from '../diff-context/diff-context';
import {
    DBCustomTypeKind,
    type DBCustomType,
} from '@/lib/domain/db-custom-type';
import { getDefaultPrimaryKeyType } from '@/lib/data/data-types/data-types';
import {
    applyFieldCommand,
    applyAreaCommand,
    applyCustomTypeCommand,
    applyIndexCommand,
    applyNoteCommand,
    applyRelationshipCommand,
    applyTableCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createAddAreaCommand,
    createAddCustomTypeCommand,
    createAddFieldCommand,
    createAddIndexCommand,
    createAddNoteCommand,
    createAddRelationshipCommand,
    createAddTableCommand,
    createDeleteAreaCommand,
    createDeleteCustomTypeCommand,
    createDeleteFieldCommand,
    createDeleteIndexCommand,
    createDeleteNoteCommand,
    createDeleteRelationshipCommand,
    createDeleteTableCommand,
    createUpdateAreaCommand,
    createUpdateCustomTypeCommand,
    createUpdateFieldCommand,
    createUpdateIndexCommand,
    createUpdateNoteCommand,
    createUpdateRelationshipCommand,
    createUpdateTableCommand,
    type DiagramFieldIndexRelationshipCommandState,
    type DiagramTableCommandState,
    type DiagramVisualCustomTypeCommandState,
    type CommandHistoryBatch,
    type CommandHistoryEntry,
    type CommandResult,
    type DiagramCommand,
    type RestoreFieldCommand,
    type RestoreTableCommand,
    type UpdateTableCommand,
} from '@/schema-core/commands';

export interface ChartDBProviderValueProps {
    diagram?: Diagram;
    readonly?: boolean;
}

export const useChartDBProviderValue = ({
    diagram,
    readonly: readonlyProp,
}: ChartDBProviderValueProps): ChartDBContext => {
    const { hasDiff } = useDiff();
    const storageDB = useStorage();
    const events = useEventEmitter<ChartDBEvent>();
    const { addUndoAction, resetRedoStack, resetUndoStack } =
        useRedoUndoStack();

    const [diagramId, setDiagramId] = useState('');
    const [diagramName, setDiagramName] = useState('');
    const [diagramCreatedAt, setDiagramCreatedAt] = useState<Date>(new Date());
    const [diagramUpdatedAt, setDiagramUpdatedAt] = useState<Date>(new Date());
    const [databaseType, setDatabaseType] = useState<DatabaseType>(
        DatabaseType.GENERIC
    );
    const [databaseEdition, setDatabaseEdition] = useState<
        DatabaseEdition | undefined
    >();
    const [tables, setTables] = useState<DBTable[]>(diagram?.tables ?? []);
    const [relationships, setRelationships] = useState<DBRelationship[]>(
        diagram?.relationships ?? []
    );
    const [dependencies, setDependencies] = useState<DBDependency[]>(
        diagram?.dependencies ?? []
    );
    const [areas, setAreas] = useState<Area[]>(diagram?.areas ?? []);
    const [customTypes, setCustomTypes] = useState<DBCustomType[]>(
        diagram?.customTypes ?? []
    );
    const [notes, setNotes] = useState<Note[]>(diagram?.notes ?? []);

    const { events: diffEvents } = useDiff();

    const [highlightedCustomTypeId, setHighlightedCustomTypeId] =
        useState<string>();

    const diffCalculatedHandler = useCallback((event: DiffCalculatedEvent) => {
        const { tablesToAdd, fieldsToAdd, relationshipsToAdd, areasToAdd } =
            event.data;
        setTables((tables) =>
            [...tables, ...(tablesToAdd ?? [])].map((table) => {
                const fields = fieldsToAdd.get(table.id);
                return fields
                    ? { ...table, fields: [...table.fields, ...fields] }
                    : table;
            })
        );
        setRelationships((relationships) => [
            ...relationships,
            ...(relationshipsToAdd ?? []),
        ]);
        setAreas((areas) => [...areas, ...(areasToAdd ?? [])]);
    }, []);

    diffEvents.useSubscription(diffCalculatedHandler);

    const defaultSchemaName = useMemo(
        () => defaultSchemas[databaseType],
        [databaseType]
    );

    const readonly = useMemo(
        () => readonlyProp ?? hasDiff ?? false,
        [readonlyProp, hasDiff]
    );

    const schemas = useMemo(
        () =>
            databasesWithSchemas.includes(databaseType)
                ? [
                      ...new Set(
                          tables
                              .map((table) => table.schema)
                              .filter((schema) => !!schema) as string[]
                      ),
                  ]
                      .sort((a, b) => {
                          if (a === defaultSchemaName) return -1;
                          if (b === defaultSchemaName) return 1;
                          return a.localeCompare(b);
                      })
                      .map(
                          (schema): DBSchema => ({
                              id: schemaNameToSchemaId(schema),
                              name: schema,
                              tableCount: tables.filter(
                                  (table) => table.schema === schema
                              ).length,
                          })
                      )
                : [],
        [tables, defaultSchemaName, databaseType]
    );

    const db = useMemo(
        () => (readonly ? storageInitialValue : storageDB),
        [storageDB, readonly]
    );
    const commandContext = useMemo(
        () => ({
            now: () => new Date(),
            generateId,
        }),
        []
    );

    const currentDiagram: Diagram = useMemo(
        () => ({
            id: diagramId,
            name: diagramName,
            createdAt: diagramCreatedAt,
            updatedAt: diagramUpdatedAt,
            databaseType,
            databaseEdition,
            tables,
            relationships,
            dependencies,
            areas,
            customTypes,
            notes,
        }),
        [
            diagramId,
            diagramName,
            databaseType,
            databaseEdition,
            tables,
            relationships,
            dependencies,
            areas,
            customTypes,
            notes,
            diagramCreatedAt,
            diagramUpdatedAt,
        ]
    );

    const createVisualCustomTypeCommandState =
        useCallback((): DiagramVisualCustomTypeCommandState => {
            return {
                databaseType,
                tables,
                areas,
                notes,
                customTypes,
            };
        }, [databaseType, tables, areas, notes, customTypes]);

    const clearDiagramData: ChartDBContext['clearDiagramData'] =
        useCallback(async () => {
            const updatedAt = new Date();
            setTables([]);
            setRelationships([]);
            setDependencies([]);
            setAreas([]);
            setCustomTypes([]);
            setNotes([]);
            setDiagramUpdatedAt(updatedAt);

            resetRedoStack();
            resetUndoStack();

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.deleteDiagramTables(diagramId),
                db.deleteDiagramRelationships(diagramId),
                db.deleteDiagramDependencies(diagramId),
                db.deleteDiagramAreas(diagramId),
                db.deleteDiagramCustomTypes(diagramId),
                db.deleteDiagramNotes(diagramId),
            ]);
        }, [db, diagramId, resetRedoStack, resetUndoStack]);

    const deleteDiagram: ChartDBContext['deleteDiagram'] =
        useCallback(async () => {
            setDiagramId('');
            setDiagramName('');
            setDatabaseType(DatabaseType.GENERIC);
            setDatabaseEdition(undefined);
            setTables([]);
            setRelationships([]);
            setDependencies([]);
            setAreas([]);
            setCustomTypes([]);
            setNotes([]);
            resetRedoStack();
            resetUndoStack();

            await Promise.all([
                db.deleteDiagramTables(diagramId),
                db.deleteDiagramRelationships(diagramId),
                db.deleteDiagram(diagramId),
                db.deleteDiagramDependencies(diagramId),
                db.deleteDiagramAreas(diagramId),
                db.deleteDiagramCustomTypes(diagramId),
                db.deleteDiagramNotes(diagramId),
            ]);
        }, [db, diagramId, resetRedoStack, resetUndoStack]);

    const updateDiagramUpdatedAt: ChartDBContext['updateDiagramUpdatedAt'] =
        useCallback(async () => {
            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await db.updateDiagram({
                id: diagramId,
                attributes: { updatedAt },
            });
        }, [db, diagramId, setDiagramUpdatedAt]);

    const updateDatabaseType: ChartDBContext['updateDatabaseType'] =
        useCallback(
            async (databaseType) => {
                setDatabaseType(databaseType);
                await db.updateDiagram({
                    id: diagramId,
                    attributes: {
                        databaseType,
                    },
                });
            },
            [db, diagramId, setDatabaseType]
        );

    const updateDatabaseEdition: ChartDBContext['updateDatabaseEdition'] =
        useCallback(
            async (databaseEdition) => {
                setDatabaseEdition(databaseEdition);
                await db.updateDiagram({
                    id: diagramId,
                    attributes: {
                        databaseEdition,
                    },
                });
            },
            [db, diagramId, setDatabaseEdition]
        );

    const updateDiagramId: ChartDBContext['updateDiagramId'] = useCallback(
        async (id) => {
            const prevId = diagramId;
            setDiagramId(id);
            await db.updateDiagram({ id: prevId, attributes: { id } });
        },
        [db, diagramId, setDiagramId]
    );

    const updateDiagramName: ChartDBContext['updateDiagramName'] = useCallback(
        async (name, options = { updateHistory: true }) => {
            const prevName = diagramName;
            setDiagramName(name);
            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await db.updateDiagram({
                id: diagramId,
                attributes: { name, updatedAt },
            });

            if (options.updateHistory) {
                addUndoAction({
                    action: 'updateDiagramName',
                    redoData: { name },
                    undoData: { name: prevName },
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setDiagramName,
            addUndoAction,
            diagramName,
            resetRedoStack,
        ]
    );

    const addTables: ChartDBContext['addTables'] = useCallback(
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
            tables,
            relationships,
            dependencies,
            notes,
            commandContext,
        ]
    );

    const addTable: ChartDBContext['addTable'] = useCallback(
        async (table: DBTable, options = { updateHistory: true }) => {
            return addTables([table], options);
        },
        [addTables]
    );

    const createTable: ChartDBContext['createTable'] = useCallback(
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

    const getTable: ChartDBContext['getTable'] = useCallback(
        (id: string) => tables.find((table) => table.id === id) ?? null,
        [tables]
    );

    const removeTables: ChartDBContext['removeTables'] = useCallback(
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
            dependencies,
            tables,
            notes,
            commandContext,
        ]
    );

    const removeTable: ChartDBContext['removeTable'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeTables([id], options);
        },
        [removeTables]
    );

    const updateTable: ChartDBContext['updateTable'] = useCallback(
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
        ]
    );

    const updateTablesState: ChartDBContext['updateTablesState'] = useCallback(
        async (
            updateFn: (tables: DBTable[]) => PartialExcept<DBTable, 'id'>[],
            options = { updateHistory: true, forceOverride: false }
        ) => {
            const updateTables = (prevTables: DBTable[]) => {
                const updatedTables = updateFn(prevTables);
                if (options.forceOverride) {
                    return updatedTables as DBTable[];
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

            const relationshipsToRemove = relationships.filter((relationship) =>
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
                    db.deleteRelationship({ diagramId, id: relationship.id })
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } })
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
        ]
    );

    const getField: ChartDBContext['getField'] = useCallback(
        (tableId: string, fieldId: string) => {
            const table = getTable(tableId);
            return table?.fields.find((f) => f.id === fieldId) ?? null;
        },
        [getTable]
    );

    const updateField: ChartDBContext['updateField'] = useCallback(
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
        ]
    );

    const removeField: ChartDBContext['removeField'] = useCallback(
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
        ]
    );

    const addField: ChartDBContext['addField'] = useCallback(
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
        ]
    );

    const createField: ChartDBContext['createField'] = useCallback(
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

    const getIndex: ChartDBContext['getIndex'] = useCallback(
        (tableId: string, indexId: string) => {
            const table = getTable(tableId);
            return table?.indexes.find((i) => i.id === indexId) ?? null;
        },
        [getTable]
    );

    const addIndex: ChartDBContext['addIndex'] = useCallback(
        async (
            tableId: string,
            index: DBIndex,
            options = { updateHistory: true }
        ) => {
            const command = createAddIndexCommand({
                context: commandContext,
                tableId,
                index,
            });
            const result = applyIndexCommand({
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addIndex',
                    redoData: { tableId, index },
                    undoData: { tableId, indexId: index.id },
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
            tables,
            relationships,
            databaseType,
            commandContext,
        ]
    );

    const removeIndex: ChartDBContext['removeIndex'] = useCallback(
        async (
            tableId: string,
            indexId: string,
            options = { updateHistory: true }
        ) => {
            const prevIndex = getIndex(tableId, indexId);
            const command = createDeleteIndexCommand({
                context: commandContext,
                tableId,
                indexId,
            });
            const result = applyIndexCommand({
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

            const dbTable = await db.getTable({
                diagramId,
                id: tableId,
            });

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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (!!prevIndex && options.updateHistory) {
                addUndoAction({
                    action: 'removeIndex',
                    redoData: { indexId, tableId },
                    undoData: { tableId, index: prevIndex },
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
            getIndex,
            tables,
            relationships,
            databaseType,
            commandContext,
        ]
    );

    const createIndex: ChartDBContext['createIndex'] = useCallback(
        async (tableId: string) => {
            const table = getTable(tableId);
            const index: DBIndex = {
                id: generateId(),
                name: `index_${(table?.indexes?.length ?? 0) + 1}`,
                fieldIds: [],
                unique: false,
                createdAt: Date.now(),
            };

            await addIndex(tableId, index);

            return index;
        },
        [addIndex, getTable]
    );

    const updateIndex: ChartDBContext['updateIndex'] = useCallback(
        async (
            tableId: string,
            indexId: string,
            index: Partial<DBIndex>,
            options = { updateHistory: true }
        ) => {
            const prevIndex = getIndex(tableId, indexId);
            const command = createUpdateIndexCommand({
                context: commandContext,
                tableId,
                indexId,
                index,
            });
            const result = applyIndexCommand({
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
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (!!prevIndex && options.updateHistory) {
                addUndoAction({
                    action: 'updateIndex',
                    redoData: { tableId, indexId, index },
                    undoData: { tableId, indexId, index: prevIndex },
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
            getIndex,
            tables,
            relationships,
            databaseType,
            commandContext,
        ]
    );

    const addCheckConstraint: ChartDBContext['addCheckConstraint'] =
        useCallback(
            async (
                tableId: string,
                constraint: DBCheckConstraint,
                options = { updateHistory: true }
            ) => {
                setTables((tables) =>
                    tables.map((t) =>
                        t.id === tableId
                            ? {
                                  ...t,
                                  checkConstraints: [
                                      ...(t.checkConstraints ?? []),
                                      constraint,
                                  ],
                              }
                            : t
                    )
                );

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
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
                        attributes: {
                            ...dbTable,
                            checkConstraints: [
                                ...(dbTable.checkConstraints ?? []),
                                constraint,
                            ],
                        },
                    }),
                ]);

                if (options.updateHistory) {
                    addUndoAction({
                        action: 'addCheckConstraint',
                        redoData: { tableId, constraint },
                        undoData: { tableId, constraintId: constraint.id },
                    });
                    resetRedoStack();
                }
            },
            [db, diagramId, setTables, addUndoAction, resetRedoStack]
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

                setTables((tables) =>
                    tables.map((t) =>
                        t.id === tableId
                            ? {
                                  ...t,
                                  checkConstraints: (
                                      t.checkConstraints ?? []
                                  ).filter((c) => c.id !== constraintId),
                              }
                            : t
                    )
                );

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
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
                        attributes: {
                            ...dbTable,
                            checkConstraints: (
                                dbTable.checkConstraints ?? []
                            ).filter((c) => c.id !== constraintId),
                        },
                    }),
                ]);

                if (!!prevConstraint && options.updateHistory) {
                    addUndoAction({
                        action: 'removeCheckConstraint',
                        redoData: { tableId, constraintId },
                        undoData: { tableId, constraint: prevConstraint },
                    });
                    resetRedoStack();
                }
            },
            [db, diagramId, setTables, addUndoAction, resetRedoStack, getTable]
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

                setTables((tables) =>
                    tables.map((t) =>
                        t.id === tableId
                            ? {
                                  ...t,
                                  checkConstraints: (
                                      t.checkConstraints ?? []
                                  ).map((c) =>
                                      c.id === constraintId
                                          ? { ...c, ...constraint }
                                          : c
                                  ),
                              }
                            : t
                    )
                );

                const dbTable = await db.getTable({ diagramId, id: tableId });
                if (!dbTable) {
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
                        attributes: {
                            ...dbTable,
                            checkConstraints: (
                                dbTable.checkConstraints ?? []
                            ).map((c) =>
                                c.id === constraintId
                                    ? { ...c, ...constraint }
                                    : c
                            ),
                        },
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
                    });
                    resetRedoStack();
                }
            },
            [db, diagramId, setTables, addUndoAction, resetRedoStack, getTable]
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

    const {
        addDependency,
        addDependencies,
        createDependency,
        getDependency,
        removeDependency,
        removeDependencies,
        updateDependency,
    } = useDependencyOperations({
        addUndoAction,
        db,
        dependencies,
        diagramId,
        getTable,
        resetRedoStack,
        setDependencies,
        setDiagramUpdatedAt,
    });

    // Area operations
    const addAreas: ChartDBContext['addAreas'] = useCallback(
        async (areas: Area[], options = { updateHistory: true }) => {
            let commandState = createVisualCustomTypeCommandState();
            const acceptedAreas: Area[] = [];
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const area of areas) {
                const command = createAddAreaCommand({
                    context: commandContext,
                    area,
                });
                const result = applyAreaCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
                if (result.status === 'success') {
                    acceptedAreas.push(area);
                }
            }

            if (acceptedAreas.length === 0) return;

            setAreas(commandState.areas);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...acceptedAreas.map((area) => db.addArea({ diagramId, area })),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addAreas',
                    redoData: { areas: acceptedAreas },
                    undoData: { areaIds: acceptedAreas.map((a) => a.id) },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setAreas,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addArea: ChartDBContext['addArea'] = useCallback(
        async (area: Area, options = { updateHistory: true }) => {
            return addAreas([area], options);
        },
        [addAreas]
    );

    const createArea: ChartDBContext['createArea'] = useCallback(
        async (attributes) => {
            const area: Area = {
                id: generateId(),
                name: `Area ${areas.length + 1}`,
                x: 0,
                y: 0,
                width: 300,
                height: 200,
                color: randomColor(),
                ...attributes,
            };

            await addArea(area);

            return area;
        },
        [areas, addArea]
    );

    const getArea: ChartDBContext['getArea'] = useCallback(
        (id: string) => areas.find((area) => area.id === id) ?? null,
        [areas]
    );

    const removeAreas: ChartDBContext['removeAreas'] = useCallback(
        async (ids: string[], options = { updateHistory: true }) => {
            let commandState = createVisualCustomTypeCommandState();
            const prevAreas = areas.filter((area) => ids.includes(area.id));
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const id of ids) {
                const command = createDeleteAreaCommand({
                    context: commandContext,
                    areaId: id,
                });
                const result = applyAreaCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
            }

            if (prevAreas.length === 0) return;

            setAreas(commandState.areas);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...prevAreas.map((area) =>
                    db.deleteArea({ diagramId, id: area.id })
                ),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (prevAreas.length > 0 && options.updateHistory) {
                addUndoAction({
                    action: 'removeAreas',
                    redoData: { areaIds: ids },
                    undoData: { areas: prevAreas },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setAreas,
            areas,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const removeArea: ChartDBContext['removeArea'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeAreas([id], options);
        },
        [removeAreas]
    );

    const updateArea: ChartDBContext['updateArea'] = useCallback(
        async (
            id: string,
            area: Partial<Area>,
            options = { updateHistory: true }
        ) => {
            const prevArea = getArea(id);
            const command = createUpdateAreaCommand({
                context: commandContext,
                areaId: id,
                area,
            });
            const result = applyAreaCommand({
                command,
                context: commandContext,
                state: createVisualCustomTypeCommandState(),
            });

            if (result.status !== 'success') return;

            setAreas(result.state.areas);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateArea({ id, attributes: area }),
            ]);

            if (!!prevArea && options.updateHistory) {
                addUndoAction({
                    action: 'updateArea',
                    redoData: { areaId: id, area },
                    undoData: { areaId: id, area: prevArea },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setAreas,
            getArea,
            addUndoAction,
            resetRedoStack,
        ]
    );

    // Note operations
    const addNotes: ChartDBContext['addNotes'] = useCallback(
        async (notes: Note[], options = { updateHistory: true }) => {
            let commandState = createVisualCustomTypeCommandState();
            const acceptedNotes: Note[] = [];
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const note of notes) {
                const command = createAddNoteCommand({
                    context: commandContext,
                    note,
                });
                const result = applyNoteCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
                if (result.status === 'success') {
                    acceptedNotes.push(note);
                }
            }

            if (acceptedNotes.length === 0) return;

            setNotes(commandState.notes);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...acceptedNotes.map((note) => db.addNote({ diagramId, note })),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addNotes',
                    redoData: { notes: acceptedNotes },
                    undoData: { noteIds: acceptedNotes.map((n) => n.id) },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setNotes,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addNote: ChartDBContext['addNote'] = useCallback(
        async (note: Note, options = { updateHistory: true }) => {
            return addNotes([note], options);
        },
        [addNotes]
    );

    const createNote: ChartDBContext['createNote'] = useCallback(
        async (attributes) => {
            const note: Note = {
                id: generateId(),
                content: '',
                x: 0,
                y: 0,
                width: 200,
                height: 150,
                color: '#ffe374', // Default warm yellow
                ...attributes,
            };

            await addNote(note);

            return note;
        },
        [addNote]
    );

    const getNote: ChartDBContext['getNote'] = useCallback(
        (id: string) => notes.find((note) => note.id === id) ?? null,
        [notes]
    );

    const removeNotes: ChartDBContext['removeNotes'] = useCallback(
        async (ids: string[], options = { updateHistory: true }) => {
            let commandState = createVisualCustomTypeCommandState();
            const prevNotes = notes.filter((note) => ids.includes(note.id));
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const id of ids) {
                const command = createDeleteNoteCommand({
                    context: commandContext,
                    noteId: id,
                });
                const result = applyNoteCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
            }

            if (prevNotes.length === 0) return;

            setNotes(commandState.notes);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                ...prevNotes.map((note) =>
                    db.deleteNote({ diagramId, id: note.id })
                ),
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
            ]);

            if (prevNotes.length > 0 && options.updateHistory) {
                addUndoAction({
                    action: 'removeNotes',
                    redoData: { noteIds: ids },
                    undoData: { notes: prevNotes },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setNotes,
            notes,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const removeNote: ChartDBContext['removeNote'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeNotes([id], options);
        },
        [removeNotes]
    );

    const updateNote: ChartDBContext['updateNote'] = useCallback(
        async (
            id: string,
            note: Partial<Note>,
            options = { updateHistory: true }
        ) => {
            const prevNote = getNote(id);
            const command = createUpdateNoteCommand({
                context: commandContext,
                noteId: id,
                note,
            });
            const result = applyNoteCommand({
                command,
                context: commandContext,
                state: createVisualCustomTypeCommandState(),
            });

            if (result.status !== 'success') return;

            setNotes(result.state.notes);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateNote({ id, attributes: note }),
            ]);

            if (!!prevNote && options.updateHistory) {
                addUndoAction({
                    action: 'updateNote',
                    redoData: { noteId: id, note },
                    undoData: { noteId: id, note: prevNote },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setNotes,
            getNote,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const highlightCustomTypeId = useCallback(
        (id?: string) => setHighlightedCustomTypeId(id),
        [setHighlightedCustomTypeId]
    );

    const highlightedCustomType = useMemo(() => {
        return highlightedCustomTypeId
            ? customTypes.find((type) => type.id === highlightedCustomTypeId)
            : undefined;
    }, [highlightedCustomTypeId, customTypes]);

    const loadDiagramFromData: ChartDBContext['loadDiagramFromData'] =
        useCallback(
            (diagram) => {
                setDiagramId(diagram.id);
                setDiagramName(diagram.name);
                setDatabaseType(diagram.databaseType);
                setDatabaseEdition(diagram.databaseEdition);
                setTables(diagram.tables ?? []);
                setRelationships(diagram.relationships ?? []);
                setDependencies(diagram.dependencies ?? []);
                setAreas(diagram.areas ?? []);
                setCustomTypes(diagram.customTypes ?? []);
                setDiagramCreatedAt(diagram.createdAt);
                setDiagramUpdatedAt(diagram.updatedAt);
                setHighlightedCustomTypeId(undefined);
                setNotes(diagram.notes ?? []);

                events.emit({ action: 'load_diagram', data: { diagram } });

                resetRedoStack();
                resetUndoStack();
            },
            [
                setDiagramId,
                setDiagramName,
                setDatabaseType,
                setDatabaseEdition,
                setTables,
                setRelationships,
                setDependencies,
                setAreas,
                setCustomTypes,
                setDiagramCreatedAt,
                setDiagramUpdatedAt,
                setHighlightedCustomTypeId,
                events,
                setNotes,
                resetRedoStack,
                resetUndoStack,
            ]
        );

    const updateDiagramData: ChartDBContext['updateDiagramData'] = useCallback(
        async (diagram, options) => {
            const st = options?.forceUpdateStorage ? storageDB : db;
            await st.deleteDiagram(diagram.id);
            await st.addDiagram({ diagram });
            loadDiagramFromData(diagram);
        },
        [db, storageDB, loadDiagramFromData]
    );

    const loadDiagram: ChartDBContext['loadDiagram'] = useCallback(
        async (diagramId: string) => {
            const diagram = await storageDB.getDiagram(diagramId, {
                includeRelationships: true,
                includeTables: true,
                includeDependencies: true,
                includeAreas: true,
                includeCustomTypes: true,
                includeNotes: true,
            });

            if (diagram) {
                loadDiagramFromData(diagram);
            }

            return diagram;
        },
        [storageDB, loadDiagramFromData]
    );

    // Custom type operations
    const getCustomType: ChartDBContext['getCustomType'] = useCallback(
        (id: string) => customTypes.find((type) => type.id === id) ?? null,
        [customTypes]
    );

    const addCustomTypes: ChartDBContext['addCustomTypes'] = useCallback(
        async (
            customTypes: DBCustomType[],
            options = { updateHistory: true }
        ) => {
            let commandState = createVisualCustomTypeCommandState();
            const acceptedCustomTypes: DBCustomType[] = [];
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const customType of customTypes) {
                const command = createAddCustomTypeCommand({
                    context: commandContext,
                    customType,
                });
                const result = applyCustomTypeCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
                if (result.status === 'success') {
                    acceptedCustomTypes.push(customType);
                }
            }

            if (acceptedCustomTypes.length === 0) return;

            setCustomTypes(commandState.customTypes);
            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                ...acceptedCustomTypes.map((customType) =>
                    db.addCustomType({ diagramId, customType })
                ),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addCustomTypes',
                    redoData: { customTypes: acceptedCustomTypes },
                    undoData: {
                        customTypeIds: acceptedCustomTypes.map((t) => t.id),
                    },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setCustomTypes,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addCustomType: ChartDBContext['addCustomType'] = useCallback(
        async (customType: DBCustomType, options = { updateHistory: true }) => {
            return addCustomTypes([customType], options);
        },
        [addCustomTypes]
    );

    const createCustomType: ChartDBContext['createCustomType'] = useCallback(
        async (attributes) => {
            const customType: DBCustomType = {
                id: generateId(),
                name: `type_${customTypes.length + 1}`,
                kind: DBCustomTypeKind.enum,
                values: [],
                fields: [],
                ...attributes,
            };

            await addCustomType(customType);
            return customType;
        },
        [addCustomType, customTypes]
    );

    const removeCustomTypes: ChartDBContext['removeCustomTypes'] = useCallback(
        async (ids, options = { updateHistory: true }) => {
            let commandState = createVisualCustomTypeCommandState();
            const typesToRemove: DBCustomType[] = [];
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const id of ids) {
                const previousType = commandState.customTypes.find(
                    (type) => type.id === id
                );
                const command = createDeleteCustomTypeCommand({
                    context: commandContext,
                    customTypeId: id,
                });
                const result = applyCustomTypeCommand({
                    command,
                    context: commandContext,
                    state: commandState,
                });
                commandHistoryEntries.push(
                    createCommandHistoryEntry({ redoCommand: command, result })
                );
                commandState = result.state;
                if (result.status === 'success' && previousType) {
                    typesToRemove.push(previousType);
                }
            }

            if (typesToRemove.length === 0) return;

            setCustomTypes(commandState.customTypes);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                ...typesToRemove.map((customType) =>
                    db.deleteCustomType({ diagramId, id: customType.id })
                ),
            ]);

            if (typesToRemove.length > 0 && options.updateHistory) {
                addUndoAction({
                    action: 'removeCustomTypes',
                    redoData: {
                        customTypeIds: typesToRemove.map((type) => type.id),
                    },
                    undoData: {
                        customTypes: typesToRemove,
                    },
                    commandHistory: createBatchedCommandHistory(
                        commandHistoryEntries
                    ),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            diagramId,
            setCustomTypes,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const removeCustomType: ChartDBContext['removeCustomType'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeCustomTypes([id], options);
        },
        [removeCustomTypes]
    );

    const updateCustomType: ChartDBContext['updateCustomType'] = useCallback(
        async (
            id: string,
            customType: Partial<DBCustomType>,
            options = { updateHistory: true }
        ) => {
            const prevCustomType = getCustomType(id);
            const command = createUpdateCustomTypeCommand({
                context: commandContext,
                customTypeId: id,
                customType,
            });
            const result = applyCustomTypeCommand({
                command,
                context: commandContext,
                state: createVisualCustomTypeCommandState(),
            });

            if (result.status !== 'success') return;

            setCustomTypes(result.state.customTypes);

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);

            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateCustomType({ id, attributes: customType }),
            ]);

            if (!!prevCustomType && options.updateHistory) {
                addUndoAction({
                    action: 'updateCustomType',
                    redoData: { customTypeId: id, customType },
                    undoData: { customTypeId: id, customType: prevCustomType },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            commandContext,
            createVisualCustomTypeCommandState,
            db,
            setCustomTypes,
            addUndoAction,
            resetRedoStack,
            getCustomType,
            diagramId,
        ]
    );

    return {
        diagramId,
        diagramName,
        databaseType,
        tables,
        relationships,
        dependencies,
        areas,
        notes,
        currentDiagram,
        schemas,
        events,
        readonly,
        updateDiagramData,
        updateDiagramId,
        updateDiagramName,
        loadDiagram,
        loadDiagramFromData,
        updateDatabaseType,
        updateDatabaseEdition,
        clearDiagramData,
        deleteDiagram,
        updateDiagramUpdatedAt,
        createTable,
        addTable,
        addTables,
        getTable,
        removeTable,
        removeTables,
        updateTable,
        updateTablesState,
        updateField,
        removeField,
        createField,
        addField,
        addIndex,
        createIndex,
        removeIndex,
        getField,
        getIndex,
        updateIndex,
        createCheckConstraint,
        addCheckConstraint,
        removeCheckConstraint,
        updateCheckConstraint,
        addRelationship,
        addRelationships,
        createRelationship,
        getRelationship,
        removeRelationship,
        removeRelationships,
        updateRelationship,
        addDependency,
        addDependencies,
        createDependency,
        getDependency,
        removeDependency,
        removeDependencies,
        updateDependency,
        createArea,
        addArea,
        addAreas,
        getArea,
        removeArea,
        removeAreas,
        updateArea,
        customTypes,
        createCustomType,
        addCustomType,
        addCustomTypes,
        getCustomType,
        removeCustomType,
        removeCustomTypes,
        updateCustomType,
        highlightCustomTypeId,
        highlightedCustomType,
        createNote,
        addNote,
        addNotes,
        getNote,
        removeNote,
        removeNotes,
        updateNote,
    };
};

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
