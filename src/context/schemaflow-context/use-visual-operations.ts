import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SchemaFlowContext } from './schemaflow-context';
import type { StorageContext } from '../storage-context/storage-context';
import type { RedoUndoStackContext } from '../history-context/redo-undo-stack-context';
import type { Area } from '@/lib/domain/area';
import type { Note } from '@/lib/domain/note';
import {
    DBCustomTypeKind,
    type DBCustomType,
} from '@/lib/domain/db-custom-type';
import type { DBTable } from '@/lib/domain/db-table';
import type { DatabaseType } from '@/lib/domain/database-type';
import { randomColor } from '@/lib/colors';
import { generateId } from '@/lib/utils';
import {
    applyAreaCommand,
    applyCustomTypeCommand,
    applyNoteCommand,
    createAddAreaCommand,
    createAddCustomTypeCommand,
    createAddNoteCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createDeleteAreaCommand,
    createDeleteCustomTypeCommand,
    createDeleteNoteCommand,
    createUpdateAreaCommand,
    createUpdateCustomTypeCommand,
    createUpdateNoteCommand,
    type CommandContext,
    type CommandHistoryBatch,
    type CommandHistoryEntry,
    type CommandResult,
    type DiagramCommand,
    type DiagramVisualCustomTypeCommandState,
} from '@/schema-core/commands';

export interface UseVisualOperationsParams {
    addUndoAction: RedoUndoStackContext['addUndoAction'];
    areas: Area[];
    commandContext: CommandContext;
    customTypes: DBCustomType[];
    databaseType: DatabaseType;
    db: StorageContext;
    diagramId: string;
    highlightedCustomTypeId: string | undefined;
    notes: Note[];
    resetRedoStack: RedoUndoStackContext['resetRedoStack'];
    setAreas: Dispatch<SetStateAction<Area[]>>;
    setCustomTypes: Dispatch<SetStateAction<DBCustomType[]>>;
    setDiagramUpdatedAt: Dispatch<SetStateAction<Date>>;
    setHighlightedCustomTypeId: Dispatch<SetStateAction<string | undefined>>;
    setNotes: Dispatch<SetStateAction<Note[]>>;
    tables: DBTable[];
}

export function useVisualOperations({
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
}: UseVisualOperationsParams): Pick<
    SchemaFlowContext,
    | 'addArea'
    | 'addAreas'
    | 'createArea'
    | 'getArea'
    | 'removeArea'
    | 'removeAreas'
    | 'updateArea'
    | 'addNote'
    | 'addNotes'
    | 'createNote'
    | 'getNote'
    | 'removeNote'
    | 'removeNotes'
    | 'updateNote'
    | 'addCustomType'
    | 'addCustomTypes'
    | 'createCustomType'
    | 'getCustomType'
    | 'highlightCustomTypeId'
    | 'highlightedCustomType'
    | 'removeCustomType'
    | 'removeCustomTypes'
    | 'updateCustomType'
> {
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

    const addAreas: SchemaFlowContext['addAreas'] = useCallback(
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
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addArea: SchemaFlowContext['addArea'] = useCallback(
        async (area: Area, options = { updateHistory: true }) => {
            return addAreas([area], options);
        },
        [addAreas]
    );

    const createArea: SchemaFlowContext['createArea'] = useCallback(
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

    const getArea: SchemaFlowContext['getArea'] = useCallback(
        (id: string) => areas.find((area) => area.id === id) ?? null,
        [areas]
    );

    const removeAreas: SchemaFlowContext['removeAreas'] = useCallback(
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
            setDiagramUpdatedAt,
            areas,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const removeArea: SchemaFlowContext['removeArea'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeAreas([id], options);
        },
        [removeAreas]
    );

    const updateArea: SchemaFlowContext['updateArea'] = useCallback(
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
            setDiagramUpdatedAt,
            getArea,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addNotes: SchemaFlowContext['addNotes'] = useCallback(
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
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addNote: SchemaFlowContext['addNote'] = useCallback(
        async (note: Note, options = { updateHistory: true }) => {
            return addNotes([note], options);
        },
        [addNotes]
    );

    const createNote: SchemaFlowContext['createNote'] = useCallback(
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

    const getNote: SchemaFlowContext['getNote'] = useCallback(
        (id: string) => notes.find((note) => note.id === id) ?? null,
        [notes]
    );

    const removeNotes: SchemaFlowContext['removeNotes'] = useCallback(
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
            setDiagramUpdatedAt,
            notes,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const removeNote: SchemaFlowContext['removeNote'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeNotes([id], options);
        },
        [removeNotes]
    );

    const updateNote: SchemaFlowContext['updateNote'] = useCallback(
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
            setDiagramUpdatedAt,
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

    const getCustomType: SchemaFlowContext['getCustomType'] = useCallback(
        (id: string) => customTypes.find((type) => type.id === id) ?? null,
        [customTypes]
    );

    const addCustomTypes: SchemaFlowContext['addCustomTypes'] = useCallback(
        async (
            customTypesToAdd: DBCustomType[],
            options = { updateHistory: true }
        ) => {
            let commandState = createVisualCustomTypeCommandState();
            const acceptedCustomTypes: DBCustomType[] = [];
            const commandHistoryEntries: Array<CommandHistoryEntry | null> = [];
            for (const customType of customTypesToAdd) {
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
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
        ]
    );

    const addCustomType: SchemaFlowContext['addCustomType'] = useCallback(
        async (customType: DBCustomType, options = { updateHistory: true }) => {
            return addCustomTypes([customType], options);
        },
        [addCustomTypes]
    );

    const createCustomType: SchemaFlowContext['createCustomType'] = useCallback(
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

    const removeCustomTypes: SchemaFlowContext['removeCustomTypes'] =
        useCallback(
            async (ids, options = { updateHistory: true }) => {
                let commandState = createVisualCustomTypeCommandState();
                const typesToRemove: DBCustomType[] = [];
                const commandHistoryEntries: Array<CommandHistoryEntry | null> =
                    [];
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
                        createCommandHistoryEntry({
                            redoCommand: command,
                            result,
                        })
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
                    db.updateDiagram({
                        id: diagramId,
                        attributes: { updatedAt },
                    }),
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
                setDiagramUpdatedAt,
                addUndoAction,
                resetRedoStack,
            ]
        );

    const removeCustomType: SchemaFlowContext['removeCustomType'] = useCallback(
        async (id: string, options = { updateHistory: true }) => {
            return removeCustomTypes([id], options);
        },
        [removeCustomTypes]
    );

    const updateCustomType: SchemaFlowContext['updateCustomType'] = useCallback(
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
            setDiagramUpdatedAt,
            addUndoAction,
            resetRedoStack,
            getCustomType,
            diagramId,
        ]
    );

    return {
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
