import type { Note } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import { cloneVisualCustomTypeState } from './apply-area-command';
import {
    createAddNoteCommand,
    createDeleteNoteCommand,
    createUpdateNoteCommand,
    type NoteCommand,
} from './note-commands';
import type { DiagramVisualCustomTypeCommandState } from './area-commands';

export function applyNoteCommand({
    command,
    context,
    state,
}: {
    command: NoteCommand;
    context: CommandContext;
    state: DiagramVisualCustomTypeCommandState;
}): CommandResult<DiagramVisualCustomTypeCommandState> {
    switch (command.type) {
        case 'note.add':
            return applyAddNoteCommand({ command, context, state });
        case 'note.update':
            return applyUpdateNoteCommand({ command, context, state });
        case 'note.delete':
            return applyDeleteNoteCommand({ command, context, state });
    }
}

function applyAddNoteCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyNoteCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'note.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const note = cloneNote(command.payload.note);
    if (state.notes.some((existingNote) => existingNote.id === note.id)) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [note.id],
            validationErrors: [
                {
                    code: 'note.duplicate_id',
                    message: 'Note already exists.',
                    entityId: note.id,
                    path: ['notes', note.id],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            notes: [...state.notes.map(cloneNote), note],
        },
        affectedEntityIds: [note.id],
        undoCommand: createDeleteNoteCommand({ context, noteId: note.id }),
    });
}

function applyUpdateNoteCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyNoteCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'note.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const previousNote = state.notes.find(
        (note) => note.id === command.payload.noteId
    );
    if (!previousNote) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [command.payload.noteId],
            validationErrors: [
                {
                    code: 'note.not_found',
                    message: 'Note was not found.',
                    entityId: command.payload.noteId,
                    path: ['notes', command.payload.noteId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            notes: state.notes.map((note) =>
                note.id === command.payload.noteId
                    ? cloneNote({ ...note, ...command.payload.note })
                    : cloneNote(note)
            ),
        },
        affectedEntityIds: [command.payload.noteId],
        undoCommand: createUpdateNoteCommand({
            context,
            noteId: command.payload.noteId,
            note: cloneNote(previousNote),
        }),
    });
}

function applyDeleteNoteCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyNoteCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'note.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const noteToDelete = state.notes.find(
        (note) => note.id === command.payload.noteId
    );
    if (!noteToDelete) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [command.payload.noteId],
            validationErrors: [
                {
                    code: 'note.not_found',
                    message: 'Note was not found.',
                    entityId: command.payload.noteId,
                    path: ['notes', command.payload.noteId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            notes: state.notes
                .filter((note) => note.id !== command.payload.noteId)
                .map(cloneNote),
        },
        affectedEntityIds: [command.payload.noteId],
        undoCommand: createAddNoteCommand({
            context,
            note: cloneNote(noteToDelete),
        }),
    });
}

function cloneNote(note: Note): Note {
    return { ...note };
}
