export interface CommandContext {
    now: () => Date;
    generateId: () => string;
}
