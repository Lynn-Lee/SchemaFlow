import type { CommandContext } from './command-context';

export interface DiagramCommand<
    TType extends string = string,
    TPayload = unknown,
> {
    id: string;
    type: TType;
    payload: TPayload;
    createdAt: string;
}

export function createDiagramCommand<TType extends string, TPayload = unknown>({
    context,
    id,
    type,
    payload,
}: {
    context: CommandContext;
    id?: string;
    type: TType;
    payload: TPayload;
}): DiagramCommand<TType, TPayload> {
    return {
        id: id ?? context.generateId(),
        type,
        payload,
        createdAt: context.now().toISOString(),
    };
}
