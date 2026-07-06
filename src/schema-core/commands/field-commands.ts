import type {
    DatabaseType,
    DBField,
    DBIndex,
    DBRelationship,
    DBTable,
} from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export interface DiagramFieldIndexRelationshipCommandState {
    databaseType?: DatabaseType;
    tables: DBTable[];
    relationships: DBRelationship[];
}

export type AddFieldCommand = DiagramCommand<
    'field.add',
    {
        tableId: string;
        field: DBField;
    }
>;

export type UpdateFieldCommand = DiagramCommand<
    'field.update',
    {
        tableId: string;
        fieldId: string;
        field: Partial<DBField>;
    }
>;

export type DeleteFieldCommand = DiagramCommand<
    'field.delete',
    {
        tableId: string;
        fieldId: string;
    }
>;

export type RestoreFieldCommand = DiagramCommand<
    'field.restore',
    {
        tableId: string;
        field: DBField;
        indexes: DBIndex[];
        relationships: DBRelationship[];
    }
>;

export type FieldCommand =
    | AddFieldCommand
    | UpdateFieldCommand
    | DeleteFieldCommand
    | RestoreFieldCommand;

export function createAddFieldCommand({
    context,
    tableId,
    field,
}: {
    context: CommandContext;
    tableId: string;
    field: DBField;
}): AddFieldCommand {
    return createDiagramCommand({
        context,
        type: 'field.add',
        payload: { tableId, field },
    });
}

export function createUpdateFieldCommand({
    context,
    tableId,
    fieldId,
    field,
}: {
    context: CommandContext;
    tableId: string;
    fieldId: string;
    field: Partial<DBField>;
}): UpdateFieldCommand {
    return createDiagramCommand({
        context,
        type: 'field.update',
        payload: { tableId, fieldId, field },
    });
}

export function createDeleteFieldCommand({
    context,
    tableId,
    fieldId,
}: {
    context: CommandContext;
    tableId: string;
    fieldId: string;
}): DeleteFieldCommand {
    return createDiagramCommand({
        context,
        type: 'field.delete',
        payload: { tableId, fieldId },
    });
}

export function createRestoreFieldCommand({
    context,
    tableId,
    field,
    indexes,
    relationships,
}: {
    context: CommandContext;
    tableId: string;
    field: DBField;
    indexes?: DBIndex[];
    relationships?: DBRelationship[];
}): RestoreFieldCommand {
    return createDiagramCommand({
        context,
        type: 'field.restore',
        payload: {
            tableId,
            field,
            indexes: indexes ?? [],
            relationships: relationships ?? [],
        },
    });
}
