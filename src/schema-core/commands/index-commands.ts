import type { DBIndex } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export type AddIndexCommand = DiagramCommand<
    'index.add',
    {
        tableId: string;
        index: DBIndex;
    }
>;

export type UpdateIndexCommand = DiagramCommand<
    'index.update',
    {
        tableId: string;
        indexId: string;
        index: Partial<DBIndex>;
    }
>;

export type DeleteIndexCommand = DiagramCommand<
    'index.delete',
    {
        tableId: string;
        indexId: string;
    }
>;

export type IndexCommand =
    | AddIndexCommand
    | UpdateIndexCommand
    | DeleteIndexCommand;

export function createAddIndexCommand({
    context,
    tableId,
    index,
}: {
    context: CommandContext;
    tableId: string;
    index: DBIndex;
}): AddIndexCommand {
    return createDiagramCommand({
        context,
        type: 'index.add',
        payload: { tableId, index },
    });
}

export function createUpdateIndexCommand({
    context,
    tableId,
    indexId,
    index,
}: {
    context: CommandContext;
    tableId: string;
    indexId: string;
    index: Partial<DBIndex>;
}): UpdateIndexCommand {
    return createDiagramCommand({
        context,
        type: 'index.update',
        payload: { tableId, indexId, index },
    });
}

export function createDeleteIndexCommand({
    context,
    tableId,
    indexId,
}: {
    context: CommandContext;
    tableId: string;
    indexId: string;
}): DeleteIndexCommand {
    return createDiagramCommand({
        context,
        type: 'index.delete',
        payload: { tableId, indexId },
    });
}
