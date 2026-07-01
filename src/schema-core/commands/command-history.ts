import type { CommandRisk, CommandResult } from './command-result';
import type { DiagramCommand } from './diagram-command';

export type SchemaCoreCommand = DiagramCommand;

export interface CommandHistoryEntry {
    redoCommand: SchemaCoreCommand;
    undoCommand: SchemaCoreCommand;
    affectedEntityIds: string[];
    risks: CommandRisk[];
}

export interface CommandHistoryBatch {
    entries: CommandHistoryEntry[];
    affectedEntityIds: string[];
    risks: CommandRisk[];
}

export function createCommandHistoryEntry<TState>({
    redoCommand,
    result,
}: {
    redoCommand: SchemaCoreCommand;
    result: CommandResult<TState>;
}): CommandHistoryEntry | null {
    if (result.status !== 'success' || !result.undoCommand) {
        return null;
    }

    return {
        redoCommand: cloneCommand(redoCommand),
        undoCommand: cloneCommand(result.undoCommand),
        affectedEntityIds: [...result.affectedEntityIds],
        risks: result.risks.map((risk) => ({
            ...risk,
            affectedEntityIds: [...risk.affectedEntityIds],
        })),
    };
}

export function createCommandHistoryBatch(
    entries: Array<CommandHistoryEntry | null>
): CommandHistoryBatch | undefined {
    const acceptedEntries = entries.filter(
        (entry): entry is CommandHistoryEntry => entry !== null
    );
    if (acceptedEntries.length === 0) {
        return undefined;
    }

    return {
        entries: acceptedEntries.map(cloneEntry),
        affectedEntityIds: uniqueStrings(
            acceptedEntries.flatMap((entry) => entry.affectedEntityIds)
        ),
        risks: acceptedEntries.flatMap((entry) =>
            entry.risks.map((risk) => ({
                ...risk,
                affectedEntityIds: [...risk.affectedEntityIds],
            }))
        ),
    };
}

function cloneEntry(entry: CommandHistoryEntry): CommandHistoryEntry {
    return {
        redoCommand: cloneCommand(entry.redoCommand),
        undoCommand: cloneCommand(entry.undoCommand),
        affectedEntityIds: [...entry.affectedEntityIds],
        risks: entry.risks.map((risk) => ({
            ...risk,
            affectedEntityIds: [...risk.affectedEntityIds],
        })),
    };
}

function cloneCommand<TCommand extends SchemaCoreCommand>(
    command: TCommand
): TCommand {
    return structuredClone(command);
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values));
}
