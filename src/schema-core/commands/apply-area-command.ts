import type { Area } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import {
    createAddAreaCommand,
    createDeleteAreaCommand,
    createUpdateAreaCommand,
    type AreaCommand,
    type DiagramVisualCustomTypeCommandState,
} from './area-commands';

export function applyAreaCommand({
    command,
    context,
    state,
}: {
    command: AreaCommand;
    context: CommandContext;
    state: DiagramVisualCustomTypeCommandState;
}): CommandResult<DiagramVisualCustomTypeCommandState> {
    switch (command.type) {
        case 'area.add':
            return applyAddAreaCommand({ command, context, state });
        case 'area.update':
            return applyUpdateAreaCommand({ command, context, state });
        case 'area.delete':
            return applyDeleteAreaCommand({ command, context, state });
    }
}

function applyAddAreaCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyAreaCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'area.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const area = cloneArea(command.payload.area);
    if (state.areas.some((existingArea) => existingArea.id === area.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [area.id],
            validationErrors: [
                {
                    code: 'area.duplicate_id',
                    message: 'Area already exists.',
                    entityId: area.id,
                    path: ['areas', area.id],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            areas: [...state.areas.map(cloneArea), area],
        },
        affectedEntityIds: [area.id],
        undoCommand: createDeleteAreaCommand({ context, areaId: area.id }),
    });
}

function applyUpdateAreaCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyAreaCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'area.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const previousArea = state.areas.find(
        (area) => area.id === command.payload.areaId
    );
    if (!previousArea) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.areaId],
            validationErrors: [
                {
                    code: 'area.not_found',
                    message: 'Area was not found.',
                    entityId: command.payload.areaId,
                    path: ['areas', command.payload.areaId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            areas: state.areas.map((area) =>
                area.id === command.payload.areaId
                    ? cloneArea({ ...area, ...command.payload.area })
                    : cloneArea(area)
            ),
        },
        affectedEntityIds: [command.payload.areaId],
        undoCommand: createUpdateAreaCommand({
            context,
            areaId: command.payload.areaId,
            area: cloneArea(previousArea),
        }),
    });
}

function applyDeleteAreaCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyAreaCommand
>[0]): CommandResult<DiagramVisualCustomTypeCommandState> {
    if (command.type !== 'area.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const areaToDelete = state.areas.find(
        (area) => area.id === command.payload.areaId
    );
    if (!areaToDelete) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.areaId],
            validationErrors: [
                {
                    code: 'area.not_found',
                    message: 'Area was not found.',
                    entityId: command.payload.areaId,
                    path: ['areas', command.payload.areaId],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            areas: state.areas
                .filter((area) => area.id !== command.payload.areaId)
                .map(cloneArea),
        },
        affectedEntityIds: [command.payload.areaId],
        undoCommand: createAddAreaCommand({
            context,
            area: cloneArea(areaToDelete),
        }),
    });
}

export function cloneVisualCustomTypeState(
    state: DiagramVisualCustomTypeCommandState
): DiagramVisualCustomTypeCommandState {
    return cloneState(state);
}

function cloneState(
    state: DiagramVisualCustomTypeCommandState
): DiagramVisualCustomTypeCommandState {
    return {
        ...state,
        tables: state.tables.map((table) => ({
            ...table,
            fields: table.fields.map((field) => ({ ...field })),
            indexes: table.indexes.map((index) => ({ ...index })),
            checkConstraints: table.checkConstraints
                ? table.checkConstraints.map((constraint) => ({
                      ...constraint,
                  }))
                : table.checkConstraints,
        })),
        areas: state.areas.map(cloneArea),
        notes: state.notes.map((note) => ({ ...note })),
        customTypes: state.customTypes.map((customType) => ({
            ...customType,
            values: customType.values
                ? [...customType.values]
                : customType.values,
            fields: customType.fields
                ? customType.fields.map((field) => ({ ...field }))
                : customType.fields,
        })),
    };
}

function cloneArea(area: Area): Area {
    return { ...area };
}
