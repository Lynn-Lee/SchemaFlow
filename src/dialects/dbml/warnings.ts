import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';
import type { Diagram } from '@/lib/domain/diagram';

interface WarningExtractionResult {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
}

export function extractDBMLImportWarnings(
    dbml: string
): WarningExtractionResult {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    for (const match of dbml.matchAll(/TableGroup\s+"?([^"{\n]+)"?\s*\{/g)) {
        const name = match[1].trim();
        unsupportedObjects.push({
            objectType: 'table_group',
            name,
            reason: 'DBML TableGroup layout metadata is not represented in the ChartDB diagram model.',
            ignored: true,
        });
        warnings.push({
            code: 'dbml.table_group_unsupported',
            severity: 'warning',
            message: `DBML TableGroup "${name}" was ignored during import.`,
            statementType: 'TableGroup',
        });
    }

    for (const match of dbml.matchAll(/Note\s+"?([^"{\n]+)"?\s*\{/g)) {
        const name = match[1].trim();
        unsupportedObjects.push({
            objectType: 'note',
            name,
            reason: 'Standalone DBML Note blocks are not mapped to ChartDB note nodes by the legacy parser.',
            ignored: true,
        });
        warnings.push({
            code: 'dbml.note_unsupported',
            severity: 'warning',
            message: `DBML Note "${name}" was ignored during import.`,
            statementType: 'Note',
        });
    }

    return { warnings, unsupportedObjects };
}

export function extractDBMLExportWarnings(
    diagram: Diagram
): WarningExtractionResult {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];
    const seenTableIdentifiers = new Set<string>();

    for (const table of diagram.tables ?? []) {
        const tableIdentifier = table.schema
            ? `${table.schema}.${table.name}`
            : table.name;

        if (table.fields.length === 0) {
            unsupportedObjects.push({
                objectType: 'table',
                name: tableIdentifier,
                reason: 'DBML export skips tables without fields because @dbml/core rejects empty table definitions.',
                ignored: true,
            });
            warnings.push({
                code: 'dbml.empty_table_skipped',
                severity: 'warning',
                message: `Table "${tableIdentifier}" was skipped during DBML export because it has no fields.`,
                statementType: 'Table',
            });
            continue;
        }

        if (seenTableIdentifiers.has(tableIdentifier)) {
            unsupportedObjects.push({
                objectType: 'table',
                name: tableIdentifier,
                reason: 'DBML export skips duplicate table identifiers to keep output parseable.',
                ignored: true,
            });
            warnings.push({
                code: 'dbml.duplicate_table_skipped',
                severity: 'warning',
                message: `Duplicate table "${tableIdentifier}" was skipped during DBML export.`,
                statementType: 'Table',
            });
            continue;
        }

        seenTableIdentifiers.add(tableIdentifier);
    }

    return { warnings, unsupportedObjects };
}
