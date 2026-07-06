import type { DBRelationship } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
    type ValidationIssue,
} from './command-result';
import type { DiagramFieldIndexRelationshipCommandState } from './field-commands';
import {
    createAddRelationshipCommand,
    createDeleteRelationshipCommand,
    createUpdateRelationshipCommand,
    type RelationshipCommand,
} from './relationship-commands';

export function applyRelationshipCommand({
    command,
    context,
    state,
}: {
    command: RelationshipCommand;
    context: CommandContext;
    state: DiagramFieldIndexRelationshipCommandState;
}): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    switch (command.type) {
        case 'relationship.add':
            return applyAddRelationshipCommand({ command, context, state });
        case 'relationship.update':
            return applyUpdateRelationshipCommand({ command, context, state });
        case 'relationship.delete':
            return applyDeleteRelationshipCommand({ command, context, state });
    }
}

function applyAddRelationshipCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyRelationshipCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'relationship.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const relationship = cloneRelationship(command.payload.relationship);
    if (
        state.relationships.some(
            (existingRelationship) =>
                existingRelationship.id === relationship.id
        )
    ) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [relationship.id],
            validationErrors: [
                {
                    code: 'relationship.duplicate_id',
                    message: 'Relationship already exists.',
                    entityId: relationship.id,
                    path: ['relationships', relationship.id],
                },
            ],
        });
    }
    const validationIssue = validateRelationshipReferences(state, relationship);
    if (validationIssue) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                relationship.id,
                validationIssue.entityId ?? relationship.id,
            ],
            validationErrors: [validationIssue],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            relationships: [
                ...state.relationships.map(cloneRelationship),
                relationship,
            ],
        },
        affectedEntityIds: [
            relationship.id,
            relationship.sourceTableId,
            relationship.sourceFieldId,
            relationship.targetTableId,
            relationship.targetFieldId,
        ],
        undoCommand: createDeleteRelationshipCommand({
            context,
            relationshipId: relationship.id,
        }),
    });
}

function applyUpdateRelationshipCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyRelationshipCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'relationship.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const previousRelationship = state.relationships.find(
        (relationship) => relationship.id === command.payload.relationshipId
    );
    if (!previousRelationship) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.relationshipId],
            validationErrors: [
                {
                    code: 'relationship.not_found',
                    message: 'Relationship was not found.',
                    entityId: command.payload.relationshipId,
                    path: ['relationships', command.payload.relationshipId],
                },
            ],
        });
    }

    const updatedRelationship = cloneRelationship({
        ...previousRelationship,
        ...command.payload.relationship,
    });
    const validationIssue = validateRelationshipReferences(
        state,
        updatedRelationship
    );
    if (validationIssue) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                updatedRelationship.id,
                validationIssue.entityId ?? updatedRelationship.id,
            ],
            validationErrors: [validationIssue],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            relationships: state.relationships.map((relationship) =>
                relationship.id === command.payload.relationshipId
                    ? updatedRelationship
                    : cloneRelationship(relationship)
            ),
        },
        affectedEntityIds: [
            updatedRelationship.id,
            updatedRelationship.sourceTableId,
            updatedRelationship.sourceFieldId,
            updatedRelationship.targetTableId,
            updatedRelationship.targetFieldId,
        ],
        undoCommand: createUpdateRelationshipCommand({
            context,
            relationshipId: command.payload.relationshipId,
            relationship: cloneRelationship(previousRelationship),
        }),
    });
}

function applyDeleteRelationshipCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyRelationshipCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'relationship.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const previousRelationship = state.relationships.find(
        (relationship) => relationship.id === command.payload.relationshipId
    );
    if (!previousRelationship) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.relationshipId],
            validationErrors: [
                {
                    code: 'relationship.not_found',
                    message: 'Relationship was not found.',
                    entityId: command.payload.relationshipId,
                    path: ['relationships', command.payload.relationshipId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            relationships: state.relationships
                .filter(
                    (relationship) =>
                        relationship.id !== command.payload.relationshipId
                )
                .map(cloneRelationship),
        },
        affectedEntityIds: [command.payload.relationshipId],
        undoCommand: createAddRelationshipCommand({
            context,
            relationship: cloneRelationship(previousRelationship),
        }),
    });
}

function validateRelationshipReferences(
    state: DiagramFieldIndexRelationshipCommandState,
    relationship: DBRelationship
): ValidationIssue | null {
    const sourceTable = state.tables.find(
        (table) => table.id === relationship.sourceTableId
    );
    if (!sourceTable) {
        return {
            code: 'relationship.source_table_not_found',
            message: 'Relationship source table was not found.',
            entityId: relationship.sourceTableId,
            path: ['relationships', relationship.id, 'sourceTableId'],
        };
    }
    const targetTable = state.tables.find(
        (table) => table.id === relationship.targetTableId
    );
    if (!targetTable) {
        return {
            code: 'relationship.target_table_not_found',
            message: 'Relationship target table was not found.',
            entityId: relationship.targetTableId,
            path: ['relationships', relationship.id, 'targetTableId'],
        };
    }
    if (
        !sourceTable.fields.some(
            (field) => field.id === relationship.sourceFieldId
        )
    ) {
        return {
            code: 'relationship.source_field_not_found',
            message: 'Relationship source field was not found.',
            entityId: relationship.sourceFieldId,
            path: ['relationships', relationship.id, 'sourceFieldId'],
        };
    }
    if (
        !targetTable.fields.some(
            (field) => field.id === relationship.targetFieldId
        )
    ) {
        return {
            code: 'relationship.target_field_not_found',
            message: 'Relationship target field was not found.',
            entityId: relationship.targetFieldId,
            path: ['relationships', relationship.id, 'targetFieldId'],
        };
    }

    return null;
}

function cloneState(
    state: DiagramFieldIndexRelationshipCommandState
): DiagramFieldIndexRelationshipCommandState {
    return {
        ...state,
        tables: state.tables.map((table) => ({
            ...table,
            fields: table.fields.map((field) => ({ ...field })),
            indexes: table.indexes.map((index) => ({
                ...index,
                fieldIds: [...index.fieldIds],
            })),
            checkConstraints: table.checkConstraints
                ? table.checkConstraints.map((constraint) => ({
                      ...constraint,
                  }))
                : table.checkConstraints,
        })),
        relationships: state.relationships.map(cloneRelationship),
    };
}

function cloneRelationship(relationship: DBRelationship): DBRelationship {
    return { ...relationship };
}
