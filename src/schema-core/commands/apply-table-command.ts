import type { DBDependency, DBRelationship, DBTable } from '../model';
import type { CommandContext } from './command-context';
import {
    createCommandRisk,
    createSuccessResult,
    createValidationErrorResult,
    type CommandResult,
} from './command-result';
import {
    createDeleteTableCommand,
    createRestoreTableCommand,
    createUpdateTableCommand,
    type DiagramTableCommandState,
    type TableCommand,
} from './table-commands';

export function applyTableCommand({
    command,
    context,
    state,
}: {
    command: TableCommand;
    context: CommandContext;
    state: DiagramTableCommandState;
}): CommandResult<DiagramTableCommandState> {
    switch (command.type) {
        case 'table.add':
            return applyAddTableCommand({ command, context, state });
        case 'table.update':
            return applyUpdateTableCommand({ command, context, state });
        case 'table.delete':
            return applyDeleteTableCommand({ command, context, state });
        case 'table.restore':
            return applyRestoreTableCommand({ command, context, state });
    }
}

function applyAddTableCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyTableCommand
>[0]): CommandResult<DiagramTableCommandState> {
    if (command.type !== 'table.add') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const table = cloneTable(command.payload.table);
    if (state.tables.some((existingTable) => existingTable.id === table.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [table.id],
            validationErrors: [
                {
                    code: 'table.duplicate_id',
                    message: 'Table already exists.',
                    entityId: table.id,
                    path: ['tables', table.id],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            tables: [...state.tables.map(cloneTable), table],
        },
        affectedEntityIds: [table.id],
        undoCommand: createDeleteTableCommand({
            context,
            tableId: table.id,
        }),
    });
}

function applyUpdateTableCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyTableCommand
>[0]): CommandResult<DiagramTableCommandState> {
    if (command.type !== 'table.update') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const previousTable = state.tables.find(
        (table) => table.id === command.payload.tableId
    );
    if (!previousTable) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.tableId],
            validationErrors: [
                {
                    code: 'table.not_found',
                    message: 'Table was not found.',
                    entityId: command.payload.tableId,
                    path: ['tables', command.payload.tableId],
                },
            ],
        });
    }

    const updatedTable = cloneTable({
        ...previousTable,
        ...command.payload.table,
    });

    return createSuccessResult({
        state: {
            ...cloneState(state),
            tables: state.tables.map((table) =>
                table.id === command.payload.tableId
                    ? updatedTable
                    : cloneTable(table)
            ),
        },
        affectedEntityIds: [command.payload.tableId],
        undoCommand: createUpdateTableCommand({
            context,
            tableId: command.payload.tableId,
            table: cloneTable(previousTable),
        }),
    });
}

function applyDeleteTableCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyTableCommand
>[0]): CommandResult<DiagramTableCommandState> {
    if (command.type !== 'table.delete') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const tableToDelete = state.tables.find(
        (table) => table.id === command.payload.tableId
    );
    if (!tableToDelete) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [command.payload.tableId],
            validationErrors: [
                {
                    code: 'table.not_found',
                    message: 'Table was not found.',
                    entityId: command.payload.tableId,
                    path: ['tables', command.payload.tableId],
                },
            ],
        });
    }

    const relationshipsToRemove = state.relationships.filter(
        (relationship) =>
            relationship.sourceTableId === command.payload.tableId ||
            relationship.targetTableId === command.payload.tableId
    );
    const dependenciesToRemove = state.dependencies.filter(
        (dependency) =>
            dependency.tableId === command.payload.tableId ||
            dependency.dependentTableId === command.payload.tableId
    );
    const affectedEntityIds = [
        command.payload.tableId,
        ...relationshipsToRemove.map((relationship) => relationship.id),
        ...dependenciesToRemove.map((dependency) => dependency.id),
    ];
    const risks =
        relationshipsToRemove.length > 0 || dependenciesToRemove.length > 0
            ? [
                  createCommandRisk({
                      level: 'high',
                      code: 'table.delete.cascade',
                      message:
                          'Deleting this table also removes relationships or dependencies.',
                      affectedEntityIds,
                  }),
              ]
            : [];

    return createSuccessResult({
        state: {
            ...cloneState(state),
            tables: state.tables
                .filter((table) => table.id !== command.payload.tableId)
                .map(cloneTable),
            relationships: state.relationships
                .filter(
                    (relationship) =>
                        !relationshipsToRemove.some(
                            (removed) => removed.id === relationship.id
                        )
                )
                .map(cloneRelationship),
            dependencies: state.dependencies
                .filter(
                    (dependency) =>
                        !dependenciesToRemove.some(
                            (removed) => removed.id === dependency.id
                        )
                )
                .map(cloneDependency),
        },
        affectedEntityIds,
        risks,
        undoCommand: createRestoreTableCommand({
            context,
            table: cloneTable(tableToDelete),
            relationships: relationshipsToRemove.map(cloneRelationship),
            dependencies: dependenciesToRemove.map(cloneDependency),
        }),
    });
}

function applyRestoreTableCommand({
    command,
    context,
    state,
}: Parameters<
    typeof applyTableCommand
>[0]): CommandResult<DiagramTableCommandState> {
    if (command.type !== 'table.restore') {
        return createValidationErrorResult({
            state,
            validationErrors: [],
        });
    }

    const { table, relationships, dependencies } = command.payload;
    if (state.tables.some((existingTable) => existingTable.id === table.id)) {
        return createValidationErrorResult({
            state: cloneState(state),
            affectedEntityIds: [table.id],
            validationErrors: [
                {
                    code: 'table.duplicate_id',
                    message: 'Table already exists.',
                    entityId: table.id,
                    path: ['tables', table.id],
                },
            ],
        });
    }

    return createSuccessResult({
        state: {
            ...cloneState(state),
            tables: [...state.tables.map(cloneTable), cloneTable(table)],
            relationships: [
                ...state.relationships.map(cloneRelationship),
                ...relationships.map(cloneRelationship),
            ],
            dependencies: [
                ...state.dependencies.map(cloneDependency),
                ...dependencies.map(cloneDependency),
            ],
        },
        affectedEntityIds: [
            table.id,
            ...relationships.map((relationship) => relationship.id),
            ...dependencies.map((dependency) => dependency.id),
        ],
        undoCommand: createDeleteTableCommand({
            context,
            tableId: table.id,
        }),
    });
}

function cloneState(state: DiagramTableCommandState): DiagramTableCommandState {
    return {
        ...state,
        tables: state.tables.map(cloneTable),
        relationships: state.relationships.map(cloneRelationship),
        dependencies: state.dependencies.map(cloneDependency),
        notes: state.notes.map((note) => ({ ...note })),
    };
}

function cloneTable(table: DBTable): DBTable {
    return {
        ...table,
        fields: table.fields.map((field) => ({ ...field })),
        indexes: table.indexes.map((index) => ({ ...index })),
        checkConstraints: table.checkConstraints
            ? table.checkConstraints.map((constraint) => ({ ...constraint }))
            : table.checkConstraints,
    };
}

function cloneRelationship(relationship: DBRelationship): DBRelationship {
    return { ...relationship };
}

function cloneDependency(dependency: DBDependency): DBDependency {
    return { ...dependency };
}
