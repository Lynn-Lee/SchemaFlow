import type { DBField, DBIndex, DBRelationship, DBTable } from '../model';
import type { CommandContext } from './command-context';
import {
    createCommandRisk,
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import {
    createDeleteFieldCommand,
    createRestoreFieldCommand,
    createUpdateFieldCommand,
    type DiagramFieldIndexRelationshipCommandState,
    type FieldCommand,
} from './field-commands';

export function applyFieldCommand({
    command,
    context,
    state,
}: {
    command: FieldCommand;
    context: CommandContext;
    state: DiagramFieldIndexRelationshipCommandState;
}): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    switch (command.type) {
        case 'field.add':
            return applyAddFieldCommand({ command, context, state });
        case 'field.update':
            return applyUpdateFieldCommand({ command, context, state });
        case 'field.delete':
            return applyDeleteFieldCommand({ command, context, state });
        case 'field.restore':
            return applyRestoreFieldCommand({ command, context, state });
    }
}

function applyAddFieldCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyFieldCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'field.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    if (table.fields.some((field) => field.id === command.payload.field.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                command.payload.tableId,
                command.payload.field.id,
            ],
            validationErrors: [
                {
                    code: 'field.duplicate_id',
                    message: 'Field already exists.',
                    entityId: command.payload.field.id,
                    path: [
                        'tables',
                        command.payload.tableId,
                        'fields',
                        command.payload.field.id,
                    ],
                },
            ],
        });
    }

    const field = cloneField(command.payload.field);
    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            fields: [...table.fields.map(cloneField), field],
            indexes: table.indexes.map(cloneIndex),
        }),
        affectedEntityIds: [command.payload.tableId, field.id],
        undoCommand: createDeleteFieldCommand({
            context,
            tableId: command.payload.tableId,
            fieldId: field.id,
        }),
    });
}

function applyUpdateFieldCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyFieldCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'field.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const previousField = table.fields.find(
        (field) => field.id === command.payload.fieldId
    );
    if (!previousField) {
        return missingFieldResult(
            state,
            command.payload.tableId,
            command.payload.fieldId
        );
    }

    const updatedField = cloneField({
        ...previousField,
        ...command.payload.field,
    });

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            fields: table.fields.map((field) =>
                field.id === command.payload.fieldId
                    ? updatedField
                    : cloneField(field)
            ),
            indexes: table.indexes.map(cloneIndex),
        }),
        affectedEntityIds: [command.payload.tableId, command.payload.fieldId],
        undoCommand: createUpdateFieldCommand({
            context,
            tableId: command.payload.tableId,
            fieldId: command.payload.fieldId,
            field: cloneField(previousField),
        }),
    });
}

function applyDeleteFieldCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyFieldCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'field.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const fieldToDelete = table.fields.find(
        (field) => field.id === command.payload.fieldId
    );
    if (!fieldToDelete) {
        return missingFieldResult(
            state,
            command.payload.tableId,
            command.payload.fieldId
        );
    }

    const impactedIndexes = table.indexes.filter((index) =>
        index.fieldIds.includes(command.payload.fieldId)
    );
    const nextIndexes = table.indexes
        .map((index) =>
            impactedIndexes.some(
                (impactedIndex) => impactedIndex.id === index.id
            )
                ? {
                      ...index,
                      fieldIds: index.fieldIds.filter(
                          (fieldId) => fieldId !== command.payload.fieldId
                      ),
                  }
                : cloneIndex(index)
        )
        .filter((index) => index.fieldIds.length > 0);
    const relationshipsToRemove = state.relationships.filter(
        (relationship) =>
            relationship.sourceFieldId === command.payload.fieldId ||
            relationship.targetFieldId === command.payload.fieldId
    );
    const affectedEntityIds = [
        command.payload.tableId,
        command.payload.fieldId,
        ...impactedIndexes.map((index) => index.id),
        ...relationshipsToRemove.map((relationship) => relationship.id),
    ];

    return createSuccessResult({
        state: {
            ...updateTable(state, command.payload.tableId, {
                ...table,
                fields: table.fields
                    .filter((field) => field.id !== command.payload.fieldId)
                    .map(cloneField),
                indexes: nextIndexes,
            }),
            relationships: state.relationships
                .filter(
                    (relationship) =>
                        !relationshipsToRemove.some(
                            (removed) => removed.id === relationship.id
                        )
                )
                .map(cloneRelationship),
        },
        affectedEntityIds,
        risks:
            impactedIndexes.length > 0 || relationshipsToRemove.length > 0
                ? [
                      createCommandRisk({
                          level: 'medium',
                          code: 'field.delete.cascade',
                          message:
                              'Deleting this field removes relationships and updates indexes that reference it.',
                          affectedEntityIds,
                      }),
                  ]
                : [],
        undoCommand: createRestoreFieldCommand({
            context,
            tableId: command.payload.tableId,
            field: cloneField(fieldToDelete),
            indexes: table.indexes.map(cloneIndex),
            relationships: relationshipsToRemove.map(cloneRelationship),
        }),
    });
}

function applyRestoreFieldCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyFieldCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'field.restore') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    if (table.fields.some((field) => field.id === command.payload.field.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                command.payload.tableId,
                command.payload.field.id,
            ],
            validationErrors: [
                {
                    code: 'field.duplicate_id',
                    message: 'Field already exists.',
                    entityId: command.payload.field.id,
                    path: [
                        'tables',
                        command.payload.tableId,
                        'fields',
                        command.payload.field.id,
                    ],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...updateTable(state, command.payload.tableId, {
                ...table,
                fields: [
                    ...table.fields.map(cloneField),
                    cloneField(command.payload.field),
                ],
                indexes: command.payload.indexes.map(cloneIndex),
            }),
            relationships: [
                ...state.relationships.map(cloneRelationship),
                ...command.payload.relationships.map(cloneRelationship),
            ],
        },
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.field.id,
            ...command.payload.indexes.map((index) => index.id),
            ...command.payload.relationships.map(
                (relationship) => relationship.id
            ),
        ],
        undoCommand: createDeleteFieldCommand({
            context,
            tableId: command.payload.tableId,
            fieldId: command.payload.field.id,
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

function missingFieldResult(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string,
    fieldId: string
): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    return createValidationErrorResult({
        state: cloneState(state),
        affectedEntityIds: [tableId, fieldId],
        validationErrors: [
            {
                code: 'field.not_found',
                message: 'Field was not found.',
                entityId: fieldId,
                path: ['tables', tableId, 'fields', fieldId],
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
        relationships: state.relationships.map(cloneRelationship),
    };
}

function cloneTable(table: DBTable): DBTable {
    return {
        ...table,
        fields: table.fields.map(cloneField),
        indexes: table.indexes.map(cloneIndex),
        checkConstraints: table.checkConstraints
            ? table.checkConstraints.map((constraint) => ({ ...constraint }))
            : table.checkConstraints,
    };
}

function cloneField(field: DBField): DBField {
    return { ...field };
}

function cloneIndex(index: DBIndex): DBIndex {
    return {
        ...index,
        fieldIds: [...index.fieldIds],
    };
}

function cloneRelationship(relationship: DBRelationship): DBRelationship {
    return { ...relationship };
}
