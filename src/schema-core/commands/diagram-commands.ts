import type {
    Area,
    DBCustomType,
    DBDependency,
    DBField,
    DBRelationship,
    DBTable,
    Diagram,
    Note,
} from '../model';
import type { CommandContext } from './command-context';
import type { DiagramCommand } from './diagram-command';
import { createDiagramCommand } from './diagram-command';

export interface DiagramCommandState {
    diagram: Diagram;
}

export interface DiagramDiffAdditions {
    tables?: DBTable[];
    fieldsByTableId?: Map<string, DBField[]>;
    relationships?: DBRelationship[];
    areas?: Area[];
    dependencies?: DBDependency[];
    customTypes?: DBCustomType[];
    notes?: Note[];
}

export type ReplaceDiagramCommand = DiagramCommand<
    'diagram.replace',
    {
        diagram: Diagram;
    }
>;

export type MergeDiagramDiffCommand = DiagramCommand<
    'diagram.mergeDiff',
    {
        additions: DiagramDiffAdditions;
    }
>;

export type DiagramStateCommand =
    | ReplaceDiagramCommand
    | MergeDiagramDiffCommand;

export function createReplaceDiagramCommand({
    context,
    diagram,
}: {
    context: CommandContext;
    diagram: Diagram;
}): ReplaceDiagramCommand {
    return createDiagramCommand({
        context,
        type: 'diagram.replace',
        payload: { diagram },
    });
}

export function createMergeDiagramDiffCommand({
    context,
    additions,
}: {
    context: CommandContext;
    additions: DiagramDiffAdditions;
}): MergeDiagramDiffCommand {
    return createDiagramCommand({
        context,
        type: 'diagram.mergeDiff',
        payload: { additions },
    });
}
