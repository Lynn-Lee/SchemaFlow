import type { DBCustomType } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export type AddCustomTypeCommand = DiagramCommand<
    'custom_type.add',
    {
        customType: DBCustomType;
    }
>;

export type UpdateCustomTypeCommand = DiagramCommand<
    'custom_type.update',
    {
        customTypeId: string;
        customType: Partial<DBCustomType>;
    }
>;

export type DeleteCustomTypeCommand = DiagramCommand<
    'custom_type.delete',
    {
        customTypeId: string;
    }
>;

export type CustomTypeCommand =
    | AddCustomTypeCommand
    | UpdateCustomTypeCommand
    | DeleteCustomTypeCommand;

export function createAddCustomTypeCommand({
    context,
    customType,
}: {
    context: CommandContext;
    customType: DBCustomType;
}): AddCustomTypeCommand {
    return createDiagramCommand({
        context,
        type: 'custom_type.add',
        payload: { customType },
    });
}

export function createUpdateCustomTypeCommand({
    context,
    customTypeId,
    customType,
}: {
    context: CommandContext;
    customTypeId: string;
    customType: Partial<DBCustomType>;
}): UpdateCustomTypeCommand {
    return createDiagramCommand({
        context,
        type: 'custom_type.update',
        payload: { customTypeId, customType },
    });
}

export function createDeleteCustomTypeCommand({
    context,
    customTypeId,
}: {
    context: CommandContext;
    customTypeId: string;
}): DeleteCustomTypeCommand {
    return createDiagramCommand({
        context,
        type: 'custom_type.delete',
        payload: { customTypeId },
    });
}
