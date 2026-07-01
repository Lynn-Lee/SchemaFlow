import type {
    DatabaseType,
    DBDependency,
    DBRelationship,
    DBTable,
    Note,
} from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export interface DiagramTableCommandState {
    databaseType?: DatabaseType;
    tables: DBTable[];
    relationships: DBRelationship[];
    dependencies: DBDependency[];
    notes: Note[];
}

export type AddTableCommand = DiagramCommand<
    'table.add',
    {
        table: DBTable;
    }
>;

export type UpdateTableCommand = DiagramCommand<
    'table.update',
    {
        tableId: string;
        table: Partial<DBTable>;
    }
>;

export type DeleteTableCommand = DiagramCommand<
    'table.delete',
    {
        tableId: string;
    }
>;

export type RestoreTableCommand = DiagramCommand<
    'table.restore',
    {
        table: DBTable;
        relationships: DBRelationship[];
        dependencies: DBDependency[];
    }
>;

export type TableCommand =
    | AddTableCommand
    | UpdateTableCommand
    | DeleteTableCommand
    | RestoreTableCommand;

export function createAddTableCommand({
    context,
    table,
}: {
    context: CommandContext;
    table: DBTable;
}): AddTableCommand {
    return createDiagramCommand({
        context,
        type: 'table.add',
        payload: { table },
    });
}

export function createUpdateTableCommand({
    context,
    tableId,
    table,
}: {
    context: CommandContext;
    tableId: string;
    table: Partial<DBTable>;
}): UpdateTableCommand {
    return createDiagramCommand({
        context,
        type: 'table.update',
        payload: { tableId, table },
    });
}

export function createDeleteTableCommand({
    context,
    tableId,
}: {
    context: CommandContext;
    tableId: string;
}): DeleteTableCommand {
    return createDiagramCommand({
        context,
        type: 'table.delete',
        payload: { tableId },
    });
}

export function createRestoreTableCommand({
    context,
    table,
    relationships,
    dependencies,
}: {
    context: CommandContext;
    table: DBTable;
    relationships?: DBRelationship[];
    dependencies?: DBDependency[];
}): RestoreTableCommand {
    return createDiagramCommand({
        context,
        type: 'table.restore',
        payload: {
            table,
            relationships: relationships ?? [],
            dependencies: dependencies ?? [],
        },
    });
}
