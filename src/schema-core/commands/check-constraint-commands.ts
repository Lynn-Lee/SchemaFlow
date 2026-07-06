import type { DBCheckConstraint } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export type AddCheckConstraintCommand = DiagramCommand<
    'check_constraint.add',
    {
        tableId: string;
        constraint: DBCheckConstraint;
    }
>;

export type UpdateCheckConstraintCommand = DiagramCommand<
    'check_constraint.update',
    {
        tableId: string;
        constraintId: string;
        constraint: Partial<DBCheckConstraint>;
    }
>;

export type DeleteCheckConstraintCommand = DiagramCommand<
    'check_constraint.delete',
    {
        tableId: string;
        constraintId: string;
    }
>;

export type CheckConstraintCommand =
    | AddCheckConstraintCommand
    | UpdateCheckConstraintCommand
    | DeleteCheckConstraintCommand;

export function createAddCheckConstraintCommand({
    context,
    tableId,
    constraint,
}: {
    context: CommandContext;
    tableId: string;
    constraint: DBCheckConstraint;
}): AddCheckConstraintCommand {
    return createDiagramCommand({
        context,
        type: 'check_constraint.add',
        payload: { tableId, constraint },
    });
}

export function createUpdateCheckConstraintCommand({
    context,
    tableId,
    constraintId,
    constraint,
}: {
    context: CommandContext;
    tableId: string;
    constraintId: string;
    constraint: Partial<DBCheckConstraint>;
}): UpdateCheckConstraintCommand {
    return createDiagramCommand({
        context,
        type: 'check_constraint.update',
        payload: { tableId, constraintId, constraint },
    });
}

export function createDeleteCheckConstraintCommand({
    context,
    tableId,
    constraintId,
}: {
    context: CommandContext;
    tableId: string;
    constraintId: string;
}): DeleteCheckConstraintCommand {
    return createDiagramCommand({
        context,
        type: 'check_constraint.delete',
        payload: { tableId, constraintId },
    });
}
