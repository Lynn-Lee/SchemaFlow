import type { DiagramCommand } from './diagram-command';

export type CommandRiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface CommandRisk {
    level: CommandRiskLevel;
    code: string;
    message: string;
    affectedEntityIds: string[];
}

export interface ValidationIssue {
    code: string;
    message: string;
    entityId?: string;
    path?: Array<string | number>;
}

export interface CommandResult<TState> {
    status: 'success' | 'validation_error';
    state: TState;
    undoCommand?: DiagramCommand;
    affectedEntityIds: string[];
    risks: CommandRisk[];
    validationErrors: ValidationIssue[];
}

export function createCommandRisk(risk: CommandRisk): CommandRisk {
    return {
        ...risk,
        affectedEntityIds: [...risk.affectedEntityIds],
    };
}

export function createSuccessResult<TState>({
    state,
    undoCommand,
    affectedEntityIds = [],
    risks = [],
}: {
    state: TState;
    undoCommand?: DiagramCommand;
    affectedEntityIds?: string[];
    risks?: CommandRisk[];
}): CommandResult<TState> {
    return {
        status: 'success',
        state,
        undoCommand,
        affectedEntityIds: [...affectedEntityIds],
        risks: risks.map(createCommandRisk),
        validationErrors: [],
    };
}

export function createValidationErrorResult<TState>({
    state,
    affectedEntityIds = [],
    validationErrors,
}: {
    state: TState;
    affectedEntityIds?: string[];
    validationErrors: ValidationIssue[];
}): CommandResult<TState> {
    return {
        status: 'validation_error',
        state,
        affectedEntityIds: [...affectedEntityIds],
        risks: [],
        validationErrors: validationErrors.map((issue) => ({
            ...issue,
            path: issue.path ? [...issue.path] : undefined,
        })),
    };
}
