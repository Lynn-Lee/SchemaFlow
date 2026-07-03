import React, { useCallback, useMemo } from 'react';
import { historyContext } from './history-context';
import { useChartDB } from '@/hooks/use-chartdb';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import type {
    RedoUndoAction,
    RedoUndoActionHandlers,
} from './redo-undo-action';
import type {
    Area,
    DBCustomType,
    DBDependency,
    DBField,
    DBIndex,
    DBRelationship,
    DBTable,
    Note,
} from '@/schema-core/model';
import type {
    CommandHistoryBatch,
    SchemaCoreCommand,
} from '@/schema-core/commands';

type CommandReplayDirection = 'redo' | 'undo';

export const HistoryProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const {
        addRedoAction,
        addUndoAction,
        undoStack,
        redoStack,
        hasRedo,
        hasUndo,
    } = useRedoUndoStack();
    const {
        addTables,
        removeTables,
        updateTable,
        updateDiagramName,
        removeField,
        addField,
        updateField,
        addRelationships,
        addDependencies,
        removeDependencies,
        updateDependency,
        updateRelationship,
        updateTablesState,
        addIndex,
        removeIndex,
        updateIndex,
        addCheckConstraint,
        removeCheckConstraint,
        updateCheckConstraint,
        removeRelationships,
        addAreas,
        removeAreas,
        updateArea,
        addCustomTypes,
        removeCustomTypes,
        updateCustomType,
        addNotes,
        removeNotes,
        updateNote,
    } = useChartDB();

    const redoActionHandlers = useMemo(
        (): RedoUndoActionHandlers => ({
            updateDiagramName: ({ redoData: { name } }) => {
                return updateDiagramName(name, { updateHistory: false });
            },
            addTables: ({ redoData: { tables } }) => {
                return addTables(tables, { updateHistory: false });
            },
            removeTables: ({ redoData: { tableIds } }) => {
                return removeTables(tableIds, { updateHistory: false });
            },
            updateTable: ({ redoData: { tableId, table } }) => {
                return updateTable(tableId, table, { updateHistory: false });
            },
            updateTablesState: ({ redoData: { tables } }) => {
                return updateTablesState(() => tables, {
                    updateHistory: false,
                    forceOverride: true,
                });
            },
            addField: ({ redoData: { tableId, field } }) => {
                return addField(tableId, field, { updateHistory: false });
            },
            removeField: ({ redoData: { tableId, fieldId } }) => {
                return removeField(tableId, fieldId, { updateHistory: false });
            },
            updateField: ({ redoData: { tableId, fieldId, field } }) => {
                return updateField(tableId, fieldId, field, {
                    updateHistory: false,
                });
            },
            addRelationships: ({ redoData: { relationships } }) => {
                return addRelationships(relationships, {
                    updateHistory: false,
                });
            },
            updateRelationship: ({
                redoData: { relationshipId, relationship },
            }) => {
                return updateRelationship(relationshipId, relationship, {
                    updateHistory: false,
                });
            },
            removeRelationships: ({ redoData: { relationshipsIds } }) => {
                return removeRelationships(relationshipsIds, {
                    updateHistory: false,
                });
            },
            addDependencies: ({ redoData: { dependencies } }) => {
                return addDependencies(dependencies, { updateHistory: false });
            },
            removeDependencies: ({ redoData: { dependenciesIds } }) => {
                return removeDependencies(dependenciesIds, {
                    updateHistory: false,
                });
            },
            updateDependency: ({ redoData: { dependencyId, dependency } }) => {
                return updateDependency(dependencyId, dependency, {
                    updateHistory: false,
                });
            },
            addIndex: ({ redoData: { tableId, index } }) => {
                return addIndex(tableId, index, { updateHistory: false });
            },
            removeIndex: ({ redoData: { tableId, indexId } }) => {
                return removeIndex(tableId, indexId, { updateHistory: false });
            },
            updateIndex: ({ redoData: { tableId, indexId, index } }) => {
                return updateIndex(tableId, indexId, index, {
                    updateHistory: false,
                });
            },
            addCheckConstraint: ({ redoData: { tableId, constraint } }) => {
                return addCheckConstraint(tableId, constraint, {
                    updateHistory: false,
                });
            },
            removeCheckConstraint: ({
                redoData: { tableId, constraintId },
            }) => {
                return removeCheckConstraint(tableId, constraintId, {
                    updateHistory: false,
                });
            },
            updateCheckConstraint: ({
                redoData: { tableId, constraintId, constraint },
            }) => {
                return updateCheckConstraint(
                    tableId,
                    constraintId,
                    constraint,
                    {
                        updateHistory: false,
                    }
                );
            },
            addAreas: ({ redoData: { areas } }) => {
                return addAreas(areas, { updateHistory: false });
            },
            removeAreas: ({ redoData: { areaIds } }) => {
                return removeAreas(areaIds, { updateHistory: false });
            },
            updateArea: ({ redoData: { areaId, area } }) => {
                return updateArea(areaId, area, { updateHistory: false });
            },
            addCustomTypes: ({ redoData: { customTypes } }) => {
                return addCustomTypes(customTypes, { updateHistory: false });
            },
            removeCustomTypes: ({ redoData: { customTypeIds } }) => {
                return removeCustomTypes(customTypeIds, {
                    updateHistory: false,
                });
            },
            updateCustomType: ({ redoData: { customTypeId, customType } }) => {
                return updateCustomType(customTypeId, customType, {
                    updateHistory: false,
                });
            },
            addNotes: ({ redoData: { notes } }) => {
                return addNotes(notes, { updateHistory: false });
            },
            removeNotes: ({ redoData: { noteIds } }) => {
                return removeNotes(noteIds, { updateHistory: false });
            },
            updateNote: ({ redoData: { noteId, note } }) => {
                return updateNote(noteId, note, { updateHistory: false });
            },
        }),
        [
            addTables,
            removeTables,
            updateTable,
            updateDiagramName,
            removeField,
            addField,
            updateField,
            addRelationships,
            updateRelationship,
            updateTablesState,
            addIndex,
            removeIndex,
            updateIndex,
            addCheckConstraint,
            removeCheckConstraint,
            updateCheckConstraint,
            removeRelationships,
            addDependencies,
            removeDependencies,
            updateDependency,
            addAreas,
            removeAreas,
            updateArea,
            addCustomTypes,
            removeCustomTypes,
            updateCustomType,
            addNotes,
            removeNotes,
            updateNote,
        ]
    );

    const undoActionHandlers = useMemo(
        (): RedoUndoActionHandlers => ({
            updateDiagramName: ({ undoData: { name } }) => {
                return updateDiagramName(name, { updateHistory: false });
            },
            addTables: ({ undoData: { tableIds } }) => {
                return removeTables(tableIds, { updateHistory: false });
            },
            removeTables: async ({
                undoData: { tables, relationships, dependencies },
            }) => {
                await Promise.all([
                    addTables(tables, { updateHistory: false }),
                    addRelationships(relationships, { updateHistory: false }),
                    addDependencies(dependencies, { updateHistory: false }),
                ]);
            },
            updateTable: ({ undoData: { tableId, table } }) => {
                return updateTable(tableId, table, { updateHistory: false });
            },
            addField: ({ undoData: { fieldId, tableId } }) => {
                return removeField(tableId, fieldId, { updateHistory: false });
            },
            removeField: async ({
                undoData: { tableId, field, relationships = [] },
            }) => {
                await addField(tableId, field, { updateHistory: false });
                if (relationships.length > 0) {
                    await addRelationships(relationships, {
                        updateHistory: false,
                    });
                }
            },
            updateField: ({ undoData: { tableId, fieldId, field } }) => {
                return updateField(tableId, fieldId, field, {
                    updateHistory: false,
                });
            },
            addRelationships: ({ undoData: { relationshipIds } }) => {
                return removeRelationships(relationshipIds, {
                    updateHistory: false,
                });
            },
            removeRelationships: ({ undoData: { relationships } }) => {
                return addRelationships(relationships, {
                    updateHistory: false,
                });
            },
            updateRelationship: ({
                undoData: { relationshipId, relationship },
            }) => {
                return updateRelationship(relationshipId, relationship, {
                    updateHistory: false,
                });
            },
            addDependencies: ({ undoData: { dependenciesIds } }) => {
                return removeDependencies(dependenciesIds, {
                    updateHistory: false,
                });
            },
            removeDependencies: ({ undoData: { dependencies } }) => {
                return addDependencies(dependencies, {
                    updateHistory: false,
                });
            },
            updateDependency: ({ undoData: { dependencyId, dependency } }) => {
                return updateDependency(dependencyId, dependency, {
                    updateHistory: false,
                });
            },
            updateTablesState: async ({
                undoData: { tables, relationships, dependencies },
            }) => {
                await Promise.all([
                    updateTablesState(() => tables, {
                        updateHistory: false,
                        forceOverride: true,
                    }),
                    addRelationships(relationships, { updateHistory: false }),
                    addDependencies(dependencies, { updateHistory: false }),
                ]);
            },
            addIndex: ({ undoData: { tableId, indexId } }) => {
                return removeIndex(tableId, indexId, { updateHistory: false });
            },
            removeIndex: ({ undoData: { tableId, index } }) => {
                return addIndex(tableId, index, { updateHistory: false });
            },
            updateIndex: ({ undoData: { tableId, indexId, index } }) => {
                return updateIndex(tableId, indexId, index, {
                    updateHistory: false,
                });
            },
            addCheckConstraint: ({ undoData: { tableId, constraintId } }) => {
                return removeCheckConstraint(tableId, constraintId, {
                    updateHistory: false,
                });
            },
            removeCheckConstraint: ({ undoData: { tableId, constraint } }) => {
                return addCheckConstraint(tableId, constraint, {
                    updateHistory: false,
                });
            },
            updateCheckConstraint: ({
                undoData: { tableId, constraintId, constraint },
            }) => {
                return updateCheckConstraint(
                    tableId,
                    constraintId,
                    constraint,
                    {
                        updateHistory: false,
                    }
                );
            },
            addAreas: ({ undoData: { areaIds } }) => {
                return removeAreas(areaIds, { updateHistory: false });
            },
            removeAreas: ({ undoData: { areas } }) => {
                return addAreas(areas, { updateHistory: false });
            },
            updateArea: ({ undoData: { areaId, area } }) => {
                return updateArea(areaId, area, { updateHistory: false });
            },
            addCustomTypes: ({ undoData: { customTypeIds } }) => {
                return removeCustomTypes(customTypeIds, {
                    updateHistory: false,
                });
            },
            removeCustomTypes: ({ undoData: { customTypes } }) => {
                return addCustomTypes(customTypes, { updateHistory: false });
            },
            updateCustomType: ({ undoData: { customTypeId, customType } }) => {
                return updateCustomType(customTypeId, customType, {
                    updateHistory: false,
                });
            },
            addNotes: ({ undoData: { noteIds } }) => {
                return removeNotes(noteIds, { updateHistory: false });
            },
            removeNotes: ({ undoData: { notes } }) => {
                return addNotes(notes, { updateHistory: false });
            },
            updateNote: ({ undoData: { noteId, note } }) => {
                return updateNote(noteId, note, { updateHistory: false });
            },
        }),
        [
            addTables,
            removeTables,
            updateTable,
            updateDiagramName,
            removeField,
            addField,
            updateField,
            addRelationships,
            updateRelationship,
            updateTablesState,
            addIndex,
            removeIndex,
            updateIndex,
            addCheckConstraint,
            removeCheckConstraint,
            updateCheckConstraint,
            removeRelationships,
            addDependencies,
            removeDependencies,
            updateDependency,
            addAreas,
            removeAreas,
            updateArea,
            addCustomTypes,
            removeCustomTypes,
            updateCustomType,
            addNotes,
            removeNotes,
            updateNote,
        ]
    );

    const canReplayCommand = (command: SchemaCoreCommand) => {
        switch (command.type) {
            case 'table.add':
            case 'table.update':
            case 'table.delete':
            case 'table.restore':
            case 'field.add':
            case 'field.update':
            case 'field.delete':
            case 'field.restore':
            case 'index.add':
            case 'index.update':
            case 'index.delete':
            case 'relationship.add':
            case 'relationship.update':
            case 'relationship.delete':
            case 'area.add':
            case 'area.update':
            case 'area.delete':
            case 'note.add':
            case 'note.update':
            case 'note.delete':
            case 'custom_type.add':
            case 'custom_type.update':
            case 'custom_type.delete':
                return true;
            default:
                return false;
        }
    };

    const replayCommand = useCallback(
        async (command: SchemaCoreCommand) => {
            switch (command.type) {
                case 'table.add': {
                    const { table } = command.payload as { table: DBTable };
                    await addTables([table], { updateHistory: false });
                    return;
                }
                case 'table.update': {
                    const { tableId, table } = command.payload as {
                        tableId: string;
                        table: Partial<DBTable>;
                    };
                    await updateTable(tableId, table, { updateHistory: false });
                    return;
                }
                case 'table.delete': {
                    const { tableId } = command.payload as { tableId: string };
                    await removeTables([tableId], { updateHistory: false });
                    return;
                }
                case 'table.restore': {
                    const { table, relationships, dependencies } =
                        command.payload as {
                            table: DBTable;
                            relationships: DBRelationship[];
                            dependencies: DBDependency[];
                        };
                    await addTables([table], { updateHistory: false });
                    await addRelationships(relationships, {
                        updateHistory: false,
                    });
                    await addDependencies(dependencies, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'field.add': {
                    const { tableId, field } = command.payload as {
                        tableId: string;
                        field: DBField;
                    };
                    await addField(tableId, field, { updateHistory: false });
                    return;
                }
                case 'field.update': {
                    const { tableId, fieldId, field } = command.payload as {
                        tableId: string;
                        fieldId: string;
                        field: Partial<DBField>;
                    };
                    await updateField(tableId, fieldId, field, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'field.delete': {
                    const { tableId, fieldId } = command.payload as {
                        tableId: string;
                        fieldId: string;
                    };
                    await removeField(tableId, fieldId, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'field.restore': {
                    const { tableId, field, indexes, relationships } =
                        command.payload as {
                            tableId: string;
                            field: DBField;
                            indexes: DBIndex[];
                            relationships: DBRelationship[];
                        };
                    await addField(tableId, field, { updateHistory: false });
                    await Promise.all([
                        ...indexes.map((index) =>
                            addIndex(tableId, index, { updateHistory: false })
                        ),
                        addRelationships(relationships, {
                            updateHistory: false,
                        }),
                    ]);
                    return;
                }
                case 'index.add': {
                    const { tableId, index } = command.payload as {
                        tableId: string;
                        index: DBIndex;
                    };
                    await addIndex(tableId, index, { updateHistory: false });
                    return;
                }
                case 'index.update': {
                    const { tableId, indexId, index } = command.payload as {
                        tableId: string;
                        indexId: string;
                        index: Partial<DBIndex>;
                    };
                    await updateIndex(tableId, indexId, index, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'index.delete': {
                    const { tableId, indexId } = command.payload as {
                        tableId: string;
                        indexId: string;
                    };
                    await removeIndex(tableId, indexId, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'relationship.add': {
                    const { relationship } = command.payload as {
                        relationship: DBRelationship;
                    };
                    await addRelationships([relationship], {
                        updateHistory: false,
                    });
                    return;
                }
                case 'relationship.update': {
                    const { relationshipId, relationship } =
                        command.payload as {
                            relationshipId: string;
                            relationship: Partial<DBRelationship>;
                        };
                    await updateRelationship(relationshipId, relationship, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'relationship.delete': {
                    const { relationshipId } = command.payload as {
                        relationshipId: string;
                    };
                    await removeRelationships([relationshipId], {
                        updateHistory: false,
                    });
                    return;
                }
                case 'area.add': {
                    const { area } = command.payload as { area: Area };
                    await addAreas([area], { updateHistory: false });
                    return;
                }
                case 'area.update': {
                    const { areaId, area } = command.payload as {
                        areaId: string;
                        area: Partial<Area>;
                    };
                    await updateArea(areaId, area, { updateHistory: false });
                    return;
                }
                case 'area.delete': {
                    const { areaId } = command.payload as { areaId: string };
                    await removeAreas([areaId], { updateHistory: false });
                    return;
                }
                case 'note.add': {
                    const { note } = command.payload as { note: Note };
                    await addNotes([note], { updateHistory: false });
                    return;
                }
                case 'note.update': {
                    const { noteId, note } = command.payload as {
                        noteId: string;
                        note: Partial<Note>;
                    };
                    await updateNote(noteId, note, { updateHistory: false });
                    return;
                }
                case 'note.delete': {
                    const { noteId } = command.payload as { noteId: string };
                    await removeNotes([noteId], { updateHistory: false });
                    return;
                }
                case 'custom_type.add': {
                    const { customType } = command.payload as {
                        customType: DBCustomType;
                    };
                    await addCustomTypes([customType], {
                        updateHistory: false,
                    });
                    return;
                }
                case 'custom_type.update': {
                    const { customTypeId, customType } = command.payload as {
                        customTypeId: string;
                        customType: Partial<DBCustomType>;
                    };
                    await updateCustomType(customTypeId, customType, {
                        updateHistory: false,
                    });
                    return;
                }
                case 'custom_type.delete': {
                    const { customTypeId } = command.payload as {
                        customTypeId: string;
                    };
                    await removeCustomTypes([customTypeId], {
                        updateHistory: false,
                    });
                    return;
                }
                default:
                    return;
            }
        },
        [
            addTables,
            updateTable,
            removeTables,
            addRelationships,
            addDependencies,
            addField,
            updateField,
            removeField,
            addIndex,
            updateIndex,
            removeIndex,
            updateRelationship,
            removeRelationships,
            addAreas,
            updateArea,
            removeAreas,
            addNotes,
            updateNote,
            removeNotes,
            addCustomTypes,
            updateCustomType,
            removeCustomTypes,
        ]
    );

    const replayCommandHistory = useCallback(
        async (
            commandHistory: CommandHistoryBatch | undefined,
            direction: CommandReplayDirection
        ) => {
            if (!commandHistory) {
                return false;
            }

            const entries =
                direction === 'undo'
                    ? [...commandHistory.entries].reverse()
                    : commandHistory.entries;
            const commands = entries.map((entry) =>
                direction === 'undo' ? entry.undoCommand : entry.redoCommand
            );

            if (!commands.every(canReplayCommand)) {
                return false;
            }

            for (const command of commands) {
                await replayCommand(command);
            }

            return true;
        },
        [replayCommand]
    );

    const runLegacyUndoHandler = async (action: RedoUndoAction) => {
        const handler = undoActionHandlers[action.action];
        await handler?.({
            undoData: action.undoData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    };

    const runLegacyRedoHandler = async (action: RedoUndoAction) => {
        const handler = redoActionHandlers[action.action];
        await handler?.({
            redoData: action.redoData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    };

    const undo = async () => {
        const action = undoStack.pop();
        if (!action) {
            return;
        }

        addRedoAction(action);

        const replayed = await replayCommandHistory(
            action.commandHistory,
            'undo'
        );
        if (!replayed) {
            await runLegacyUndoHandler(action);
        }
    };

    const redo = async () => {
        const action = redoStack.pop();
        if (!action) {
            return;
        }

        addUndoAction(action);

        const replayed = await replayCommandHistory(
            action.commandHistory,
            'redo'
        );
        if (!replayed) {
            await runLegacyRedoHandler(action);
        }
    };

    return (
        <historyContext.Provider value={{ undo, redo, hasRedo, hasUndo }}>
            {children}
        </historyContext.Provider>
    );
};
