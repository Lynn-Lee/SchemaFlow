import { useCallback, useMemo, useState } from 'react';
import type { DBTable } from '@/lib/domain/db-table';
import { generateId } from '@/lib/utils';
import type { ChartDBContext, ChartDBEvent } from './chartdb-context';
import { useDependencyOperations } from './use-dependency-operations';
import { useTableFieldOperations } from './use-table-field-operations';
import { useVisualOperations } from './use-visual-operations';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBIndex } from '@/lib/domain/db-index';
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
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import {
    applyIndexCommand,
    applyRelationshipCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createAddIndexCommand,
    createAddRelationshipCommand,
    createDeleteIndexCommand,
    createDeleteRelationshipCommand,
    createUpdateIndexCommand,
    createUpdateRelationshipCommand,
    type DiagramFieldIndexRelationshipCommandState,
    type CommandHistoryBatch,
    type CommandHistoryEntry,
    type CommandResult,
    type DiagramCommand,
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

    const {
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
    } = useTableFieldOperations({
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
    });

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

    const {
        addArea,
        addAreas,
        createArea,
        getArea,
        removeArea,
        removeAreas,
        updateArea,
        addNote,
        addNotes,
        createNote,
        getNote,
        removeNote,
        removeNotes,
        updateNote,
        addCustomType,
        addCustomTypes,
        createCustomType,
        getCustomType,
        highlightCustomTypeId,
        highlightedCustomType,
        removeCustomType,
        removeCustomTypes,
        updateCustomType,
    } = useVisualOperations({
        addUndoAction,
        areas,
        commandContext,
        customTypes,
        databaseType,
        db,
        diagramId,
        highlightedCustomTypeId,
        notes,
        resetRedoStack,
        setAreas,
        setCustomTypes,
        setDiagramUpdatedAt,
        setHighlightedCustomTypeId,
        setNotes,
        tables,
    });

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
