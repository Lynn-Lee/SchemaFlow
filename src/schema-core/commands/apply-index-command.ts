import type { DBIndex, DBTable } from '../model';
import type { CommandContext } from './command-context';
import {
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import type { DiagramFieldIndexRelationshipCommandState } from './field-commands';
import {
    createAddIndexCommand,
    createDeleteIndexCommand,
    createUpdateIndexCommand,
    type IndexCommand,
} from './index-commands';

export function applyIndexCommand({
    command,
    context,
    state,
}: {
    command: IndexCommand;
    context: CommandContext;
    state: DiagramFieldIndexRelationshipCommandState;
}): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    switch (command.type) {
        case 'index.add':
            return applyAddIndexCommand({ command, context, state });
        case 'index.update':
            return applyUpdateIndexCommand({ command, context, state });
        case 'index.delete':
            return applyDeleteIndexCommand({ command, context, state });
    }
}

function applyAddIndexCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyIndexCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'index.add') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    if (table.indexes.some((index) => index.id === command.payload.index.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [
                command.payload.tableId,
                command.payload.index.id,
            ],
            validationErrors: [
                {
                    code: 'index.duplicate_id',
                    message: 'Index already exists.',
                    entityId: command.payload.index.id,
                    path: [
                        'tables',
                        command.payload.tableId,
                        'indexes',
                        command.payload.index.id,
                    ],
                },
            ],
        });
    }
    const fieldValidation = validateIndexFieldIds({
        table,
        tableId: command.payload.tableId,
        indexId: command.payload.index.id,
        fieldIds: command.payload.index.fieldIds,
        state,
    });
    if (fieldValidation) {
        return fieldValidation;
    }

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            indexes: [
                ...table.indexes.map(cloneIndex),
                cloneIndex(command.payload.index),
            ],
        }),
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.index.id,
            ...command.payload.index.fieldIds,
        ],
        undoCommand: createDeleteIndexCommand({
            context,
            tableId: command.payload.tableId,
            indexId: command.payload.index.id,
        }),
    });
}

function applyUpdateIndexCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyIndexCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'index.update') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const previousIndex = table.indexes.find(
        (index) => index.id === command.payload.indexId
    );
    if (!previousIndex) {
        return missingIndexResult(
            state,
            command.payload.tableId,
            command.payload.indexId
        );
    }
    const nextIndex = cloneIndex({
        ...previousIndex,
        ...command.payload.index,
    });
    const fieldValidation = validateIndexFieldIds({
        table,
        tableId: command.payload.tableId,
        indexId: command.payload.indexId,
        fieldIds: nextIndex.fieldIds,
        state,
    });
    if (fieldValidation) {
        return fieldValidation;
    }

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            indexes: table.indexes.map((index) =>
                index.id === command.payload.indexId
                    ? nextIndex
                    : cloneIndex(index)
            ),
        }),
        affectedEntityIds: [
            command.payload.tableId,
            command.payload.indexId,
            ...nextIndex.fieldIds,
        ],
        undoCommand: createUpdateIndexCommand({
            context,
            tableId: command.payload.tableId,
            indexId: command.payload.indexId,
            index: cloneIndex(previousIndex),
        }),
    });
}

function applyDeleteIndexCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyIndexCommand
>[0]): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    if (command.type !== 'index.delete') {
        return createValidationErrorResult({ state, validationErrors: [] });
    }

    const table = findTable(state, command.payload.tableId);
    if (!table) {
        return missingTableResult(state, command.payload.tableId);
    }
    const indexToDelete = table.indexes.find(
        (index) => index.id === command.payload.indexId
    );
    if (!indexToDelete) {
        return missingIndexResult(
            state,
            command.payload.tableId,
            command.payload.indexId
        );
    }

    return createSuccessResult({
        state: updateTable(state, command.payload.tableId, {
            ...table,
            indexes: table.indexes
                .filter((index) => index.id !== command.payload.indexId)
                .map(cloneIndex),
        }),
        affectedEntityIds: [command.payload.tableId, command.payload.indexId],
        undoCommand: createAddIndexCommand({
            context,
            tableId: command.payload.tableId,
            index: cloneIndex(indexToDelete),
        }),
    });
}

function validateIndexFieldIds({
    table,
    tableId,
    indexId,
    fieldIds,
    state,
}: {
    table: DBTable;
    tableId: string;
    indexId: string;
    fieldIds: string[];
    state: DiagramFieldIndexRelationshipCommandState;
}): CommandResult<DiagramFieldIndexRelationshipCommandState> | null {
    const missingFieldId = fieldIds.find(
        (fieldId) => !table.fields.some((field) => field.id === fieldId)
    );
    if (!missingFieldId) {
        return null;
    }

    return createValidationErrorResult({
        state: cloneState(state),
        affectedEntityIds: [tableId, indexId, missingFieldId],
        validationErrors: [
            {
                code: 'index.field_not_found',
                message: 'Index field was not found.',
                entityId: missingFieldId,
                path: ['tables', tableId, 'indexes', indexId, 'fieldIds'],
            },
        ],
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

function missingIndexResult(
    state: DiagramFieldIndexRelationshipCommandState,
    tableId: string,
    indexId: string
): CommandResult<DiagramFieldIndexRelationshipCommandState> {
    return createValidationErrorResult({
        state: cloneState(state),
        affectedEntityIds: [tableId, indexId],
        validationErrors: [
            {
                code: 'index.not_found',
                message: 'Index was not found.',
                entityId: indexId,
                path: ['tables', tableId, 'indexes', indexId],
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
        indexes: table.indexes.map(cloneIndex),
        checkConstraints: table.checkConstraints
            ? table.checkConstraints.map((constraint) => ({ ...constraint }))
            : table.checkConstraints,
    };
}

function cloneIndex(index: DBIndex): DBIndex {
    return {
        ...index,
        fieldIds: [...index.fieldIds],
    };
}
