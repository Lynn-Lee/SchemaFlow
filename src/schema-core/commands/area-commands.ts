import type { Area, DatabaseType, DBCustomType, DBTable, Note } from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export interface DiagramVisualCustomTypeCommandState {
    databaseType?: DatabaseType;
    tables: DBTable[];
    areas: Area[];
    notes: Note[];
    customTypes: DBCustomType[];
}

export type AddAreaCommand = DiagramCommand<
    'area.add',
    {
        area: Area;
    }
>;

export type UpdateAreaCommand = DiagramCommand<
    'area.update',
    {
        areaId: string;
        area: Partial<Area>;
    }
>;

export type DeleteAreaCommand = DiagramCommand<
    'area.delete',
    {
        areaId: string;
    }
>;

export type AreaCommand =
    | AddAreaCommand
    | UpdateAreaCommand
    | DeleteAreaCommand;

export function createAddAreaCommand({
    context,
    area,
}: {
    context: CommandContext;
    area: Area;
}): AddAreaCommand {
    return createDiagramCommand({
        context,
        type: 'area.add',
        payload: { area },
    });
}

export function createUpdateAreaCommand({
    context,
    areaId,
    area,
}: {
    context: CommandContext;
    areaId: string;
    area: Partial<Area>;
}): UpdateAreaCommand {
    return createDiagramCommand({
        context,
        type: 'area.update',
        payload: { areaId, area },
    });
}

export function createDeleteAreaCommand({
    context,
    areaId,
}: {
    context: CommandContext;
    areaId: string;
}): DeleteAreaCommand {
    return createDiagramCommand({
        context,
        type: 'area.delete',
        payload: { areaId },
    });
}
