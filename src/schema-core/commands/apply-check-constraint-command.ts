import type { DBCheckConstraint, DBTable } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import type { DiagramFieldIndexRelationshipCommandState } from './field-commands';
import {
    createAddCheckConstraintCommand,
    createDeleteCheckConstraintCommand,
    createUpdateCheckConstraintCommand,
    type CheckConstraintCommand,
} from './check-constraint-commands';

export function applyCheckConstraintCommand({
    command,
    context,
    state,
}: {
    command: CheckConstraintCommand;
    context: CommandContext;
    state: DiagramFieldIndexRelationshipCommandState;
}): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    switch (command.type) {
        case 'check_constraint.add':
            return applyAddCheckConstraintCommand({ command, context, state });
        case 'check_constraint.update':
            return applyUpdateCheckConstraintCommand({
                command,
                context,
                state,
            });
        case 'check_constraint.delete':
            return applyDeleteCheckConstraintCommand({
                command,
                context,
                state,
            });
    }
}

function applyAddCheckConstraintCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCheckConstraintCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'check_constraint.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    if (
        (table.checkConstraints ?? []).some(
            (constraint) => constraint.id === command.payload.constraint.id
        )
    ) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                command.payload.tableId,
                command.payload.constraint.id,
            ],
            validationErrors: [
                {
                    code: 'check_constraint.duplicate_id',
                    message: 'Check constraint already exists.',
                    entityId: command.payload.constraint.id,
                    path: [
                        'tables',
                        command.payload.tableId,
                        'checkConstraints',
                        command.payload.constraint.id,
                    ],
                },
            ],
        });
    }

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            checkConstraints: [
                ...(table.checkConstraints ?? []).map(cloneCheckConstraint),
                cloneCheckConstraint(command.payload.constraint),
            ],
        }),
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.constraint.id,
        ],
        undoCommand: createDeleteCheckConstraintCommand({
            context,
            tableId: command.payload.tableId,
            constraintId: command.payload.constraint.id,
        }),
    });
}

function applyUpdateCheckConstraintCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCheckConstraintCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'check_constraint.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const previousConstraint = (table.checkConstraints ?? []).find(
        (constraint) => constraint.id === command.payload.constraintId
    );
    if (!previousConstraint) {
        return missingCheckConstraintResult(
            state,
            command.payload.tableId,
            command.payload.constraintId
        );
    }
    const nextConstraint = cloneCheckConstraint({
        ...previousConstraint,
        ...command.payload.constraint,
    });

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            checkConstraints: (table.checkConstraints ?? []).map(
                (constraint) =>
                    constraint.id === command.payload.constraintId
                        ? nextConstraint
                        : cloneCheckConstraint(constraint)
            ),
        }),
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.constraintId,
        ],
        undoCommand: createUpdateCheckConstraintCommand({
            context,
            tableId: command.payload.tableId,
            constraintId: command.payload.constraintId,
            constraint: cloneCheckConstraint(previousConstraint),
        }),
    });
}

function applyDeleteCheckConstraintCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCheckConstraintCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'check_constraint.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const previousConstraint = (table.checkConstraints ?? []).find(
        (constraint) => constraint.id === command.payload.constraintId
    );
    if (!previousConstraint) {
        return missingCheckConstraintResult(
            state,
            command.payload.tableId,
            command.payload.constraintId
        );
    }

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            checkConstraints: (table.checkConstraints ?? [])
                .filter(
                    (constraint) =>
                        constraint.id !== command.payload.constraintId
                )
                .map(cloneCheckConstraint),
        }),
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.constraintId,
        ],
        undoCommand: createAddCheckConstraintCommand({
            context,
            tableId: command.payload.tableId,
            constraint: cloneCheckConstraint(previousConstraint),
        }),
    });
}

function missingTableResult(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string
): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    return createValidationErrorResult({
        state: cloneState(state),
        affectedEntityIds: [tableId],
        validationErrors: [
            {
                code: 'table.not_found',
                message: 'Table was not found.',
                entityId: tableId,
                path: ['tables', tableId],
            },
        ],
    });
}

function missingCheckConstraintResult(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string,
    constraintId: string
): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    return createValidationErrorResult({
        state: cloneState(state),
        affectedEntityIds: [tableId, constraintId],
        validationErrors: [
            {
                code: 'check_constraint.not_found',
                message: 'Check constraint was not found.',
                entityId: constraintId,
                path: ['tables', tableId, 'checkConstraints', constraintId],
            },
        ],
    });
}

function findTable(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string
): DBTable | undefined {
    return state.tables.find((table) => table.id === tableId);
}

function updateTable(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string,
    updatedTable: DBTable
): DiagramFieldIndexRelationshipCommandState {
    return {
        ...cloneState(state),
        tables: state.tables.map((table) =>
            table.id === tableId ? cloneTable(updatedTable) : cloneTable(table)
        ),
    };
}

function cloneState(
    state: DiagramFieldIndexRelationshipCommandState
): DiagramFieldIndexRelationshipCommandState {
    return {
        ...state,
        tables: state.tables.map(cloneTable),
        relationships: state.relationships.map((relationship) => ({
            ...relationship,
        })),
    };
}

function cloneTable(table: DBTable): DBTable {
    return {
        ...table,
        fields: table.fields.map((field) => ({ ...field })),
        indexes: table.indexes.map((index) => ({
            ...index,
            fieldIds: [...index.fieldIds],
        })),
        checkConstraints: table.checkConstraints
            ? table.checkConstraints.map(cloneCheckConstraint)
            : table.checkConstraints,
    };
}

function cloneCheckConstraint(
    constraint: DBCheckConstraint
): DBCheckConstraint {
    return { ...constraint };
}
