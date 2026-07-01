import type { Note } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export type AddNoteCommand = DiagramCommand<
    'note.add',
    {
        note: Note;
    }
>;

export type UpdateNoteCommand = DiagramCommand<
    'note.update',
    {
        noteId: string;
        note: Partial<Note>;
    }
>;

export type DeleteNoteCommand = DiagramCommand<
    'note.delete',
    {
        noteId: string;
    }
>;

export type NoteCommand =
    | AddNoteCommand
    | UpdateNoteCommand
    | DeleteNoteCommand;

export function createAddNoteCommand({
    context,
    note,
}: {
    context: CommandContext;
    note: Note;
}): AddNoteCommand {
    return createDiagramCommand({
        context,
        type: 'note.add',
        payload: { note },
    });
}

export function createUpdateNoteCommand({
    context,
    noteId,
    note,
}: {
    context: CommandContext;
    noteId: string;
    note: Partial<Note>;
}): UpdateNoteCommand {
    return createDiagramCommand({
        context,
        type: 'note.update',
        payload: { noteId, note },
    });
}

export function createDeleteNoteCommand({
    context,
    noteId,
}: {
    context: CommandContext;
    noteId: string;
}): DeleteNoteCommand {
    return createDiagramCommand({
        context,
        type: 'note.delete',
        payload: { noteId },
    });
}
