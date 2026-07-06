import type { DBCustomType } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import { cloneVisualCustomTypeState } from './apply-area-command';
import {
    createAddCustomTypeCommand,
    createDeleteCustomTypeCommand,
    createUpdateCustomTypeCommand,
    type CustomTypeCommand,
} from './custom-type-commands';
import type { DiagramVisualCustomTypeCommandState } from './area-commands';

export function applyCustomTypeCommand({
    command,
    context,
    state,
}: {
    command: CustomTypeCommand;
    context: CommandContext;
    state: DiagramVisualCustomTypeCommandState;
}): CommandResult<DiagramVisualCustomTypeCommandState> {
    switch (command.type) {
        case 'custom_type.add':
            return applyAddCustomTypeCommand({ command, context, state });
        case 'custom_type.update':
            return applyUpdateCustomTypeCommand({ command, context, state });
        case 'custom_type.delete':
            return applyDeleteCustomTypeCommand({ command, context, state });
    }
}

function applyAddCustomTypeCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCustomTypeCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'custom_type.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const customType = cloneCustomType(command.payload.customType);
    if (
        state.customTypes.some(
            (existingType) => existingType.id === customType.id
        )
    ) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [customType.id],
            validationErrors: [
                {
                    code: 'custom_type.duplicate_id',
                    message: 'Custom type already exists.',
                    entityId: customType.id,
                    path: ['customTypes', customType.id],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            customTypes: [
                ...state.customTypes.map(cloneCustomType),
                customType,
            ],
        },
        affectedEntityIds: [customType.id],
        undoCommand: createDeleteCustomTypeCommand({
            context,
            customTypeId: customType.id,
        }),
    });
}

function applyUpdateCustomTypeCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCustomTypeCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'custom_type.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const previousType = state.customTypes.find(
        (customType) => customType.id === command.payload.customTypeId
    );
    if (!previousType) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [command.payload.customTypeId],
            validationErrors: [
                {
                    code: 'custom_type.not_found',
                    message: 'Custom type was not found.',
                    entityId: command.payload.customTypeId,
                    path: ['customTypes', command.payload.customTypeId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            customTypes: state.customTypes.map((customType) =>
                customType.id === command.payload.customTypeId
                    ? cloneCustomType({
                          ...customType,
                          ...command.payload.customType,
                      })
                    : cloneCustomType(customType)
            ),
        },
        affectedEntityIds: [command.payload.customTypeId],
        undoCommand: createUpdateCustomTypeCommand({
            context,
            customTypeId: command.payload.customTypeId,
            customType: cloneCustomType(previousType),
        }),
    });
}

function applyDeleteCustomTypeCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyCustomTypeCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'custom_type.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const typeToDelete = state.customTypes.find(
        (customType) => customType.id === command.payload.customTypeId
    );
    if (!typeToDelete) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [command.payload.customTypeId],
            validationErrors: [
                {
                    code: 'custom_type.not_found',
                    message: 'Custom type was not found.',
                    entityId: command.payload.customTypeId,
                    path: ['customTypes', command.payload.customTypeId],
                },
            ],
        });
    }

    const referencingFieldIds = state.tables.flatMap((table) =>
        table.fields
            .filter((field) => field.type.id === command.payload.customTypeId)
            .map((field) => field.id)
    );
    if (referencingFieldIds.length > 0) {
        return createValidationErrorResult({
            state: cloneVisualCustomTypeState(state),
            affectedEntityIds: [
                command.payload.customTypeId,
                ...referencingFieldIds,
            ],
            validationErrors: [
                {
                    code: 'custom_type.in_use',
                    message: 'Custom type is still used by table fields.',
                    entityId: command.payload.customTypeId,
                    path: ['customTypes', command.payload.customTypeId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneVisualCustomTypeState(state),
            customTypes: state.customTypes
                .filter(
                    (customType) =>
                        customType.id !== command.payload.customTypeId
                )
                .map(cloneCustomType),
        },
        affectedEntityIds: [command.payload.customTypeId],
        undoCommand: createAddCustomTypeCommand({
            context,
            customType: cloneCustomType(typeToDelete),
        }),
    });
}

function cloneCustomType(customType: DBCustomType): DBCustomType {
    return {
        ...customType,
        values: customType.values ? [...customType.values] : customType.values,
        fields: customType.fields
            ? customType.fields.map((field) => ({ ...field }))
            : customType.fields,
    };
}
