import type { DialectType } from './importer';

export type SupportLevel = 'full' | 'partial' | 'experimental' | 'unsupported';

export type DialectCapabilityKey =
    | 'tables'
    | 'fields'
    | 'relationships'
    | 'indexes'
    | 'views'
    | 'schemas'
    | 'customTypes'
    | 'comments'
    | 'checks'
    | 'extensions'
    | 'triggers'
    | 'procedures';

export type DialectCapabilityMap = Partial<
    Record<DialectCapabilityKey, SupportLevel>
>;

export interface DialectCapabilities {
    dialect: DialectType;
    import: DialectCapabilityMap;
    export: DialectCapabilityMap;
    unsupportedSyntax: string[];
    warningRules: string[];
}

export function createDialectCapabilities({
    dialect,
    import: importCapabilities = {},
    export: exportCapabilities = {},
    unsupportedSyntax = [],
    warningRules = [],
}: {
    dialect: DialectType;
    import?: DialectCapabilityMap;
    export?: DialectCapabilityMap;
    unsupportedSyntax?: string[];
    warningRules?: string[];
}): DialectCapabilities {
    return {
        dialect,
        import: importCapabilities,
        export: exportCapabilities,
        unsupportedSyntax,
        warningRules,
    };
}

export function getCapabilitySupport(
    capabilities: DialectCapabilities,
    direction: 'import' | 'export',
    capability: DialectCapabilityKey
): SupportLevel {
    return capabilities[direction][capability] ?? 'unsupported';
}
