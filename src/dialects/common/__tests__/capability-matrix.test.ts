import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';
import {
    createDialectCapabilities,
    getCapabilitySupport,
    type DialectCapabilities,
} from '../capability-matrix';
import {
    createImportResult,
    wrapLegacySchemaImporter,
    type SchemaImporter,
} from '../importer';
import {
    createExportResult,
    wrapLegacySchemaExporter,
    type SchemaExporter,
} from '../exporter';

function createDiagram(databaseType: DatabaseType): Diagram {
    return {
        id: 'diagram-1',
        name: 'Imported schema',
        databaseType,
        tables: [],
        relationships: [],
        createdAt: new Date('2026-07-01T00:00:00.000Z'),
        updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    };
}

describe('dialect capability matrix contract', () => {
    it('defaults missing support levels to unsupported', () => {
        const capabilities = createDialectCapabilities({
            dialect: DatabaseType.POSTGRESQL,
            import: {
                tables: 'full',
                relationships: 'partial',
            },
            export: {
                tables: 'full',
            },
        });

        expect(getCapabilitySupport(capabilities, 'import', 'tables')).toBe(
            'full'
        );
        expect(
            getCapabilitySupport(capabilities, 'import', 'relationships')
        ).toBe('partial');
        expect(getCapabilitySupport(capabilities, 'export', 'views')).toBe(
            'unsupported'
        );
    });

    it('keeps unsupported syntax and warning rules in the capability contract', () => {
        const capabilities: DialectCapabilities = createDialectCapabilities({
            dialect: DatabaseType.MYSQL,
            import: {
                tables: 'partial',
            },
            export: {
                tables: 'partial',
                customTypes: 'unsupported',
            },
            unsupportedSyntax: ['trigger', 'procedure'],
            warningRules: [
                'generated column details are downgraded during import',
            ],
        });

        expect(capabilities.unsupportedSyntax).toEqual([
            'trigger',
            'procedure',
        ]);
        expect(capabilities.warningRules).toContain(
            'generated column details are downgraded during import'
        );
    });
});

describe('schema importer/exporter result contract', () => {
    it('creates import results with warnings, unsupported objects and source map', () => {
        const diagram = createDiagram(DatabaseType.POSTGRESQL);

        const result = createImportResult({
            diagram,
            sourceDialect: DatabaseType.POSTGRESQL,
            warnings: [
                {
                    code: 'postgres.extension_ignored',
                    severity: 'warning',
                    message: 'Extension runtime behavior is not imported.',
                    statementType: 'CREATE EXTENSION',
                    sourceRange: { startLine: 1, endLine: 1 },
                },
            ],
            unsupportedObjects: [
                {
                    objectType: 'extension',
                    name: 'postgis',
                    reason: 'Extension runtime behavior has no diagram shape.',
                    ignored: true,
                },
            ],
            sourceMap: {
                tables: {
                    users: { statementIndex: 2, startLine: 10, endLine: 14 },
                },
            },
        });

        expect(result.diagram).toBe(diagram);
        expect(result.sourceDialect).toBe(DatabaseType.POSTGRESQL);
        expect(result.warnings[0].severity).toBe('warning');
        expect(result.unsupportedObjects[0].ignored).toBe(true);
        expect(result.sourceMap.tables?.users?.startLine).toBe(10);
    });

    it('wraps legacy importers without changing their diagram output', async () => {
        const diagram = createDiagram(DatabaseType.SQLITE);
        const importer: SchemaImporter<{ sql: string }> =
            wrapLegacySchemaImporter({
                sourceDialect: DatabaseType.SQLITE,
                importDiagram: async ({ sql }) => ({
                    ...diagram,
                    name: sql,
                }),
            });

        const result = await importer.importSchema({ sql: 'CREATE TABLE t;' });

        expect(result.diagram.name).toBe('CREATE TABLE t;');
        expect(result.sourceDialect).toBe(DatabaseType.SQLITE);
        expect(result.warnings).toEqual([]);
        expect(result.unsupportedObjects).toEqual([]);
        expect(result.sourceMap).toEqual({});
    });

    it('creates export results with output, warnings and risk level', () => {
        const result = createExportResult({
            output: 'CREATE TABLE users (id integer);',
            targetDialect: DatabaseType.SQL_SERVER,
            riskLevel: 'medium',
            warnings: [
                {
                    code: 'sqlserver.identity_downgrade',
                    severity: 'warning',
                    message: 'Identity options were simplified.',
                },
            ],
            unsupportedObjects: [
                {
                    objectType: 'index',
                    name: 'users_partial_idx',
                    reason: 'Filtered indexes are not emitted yet.',
                    ignored: true,
                },
            ],
        });

        expect(result.output).toContain('CREATE TABLE users');
        expect(result.targetDialect).toBe(DatabaseType.SQL_SERVER);
        expect(result.riskLevel).toBe('medium');
        expect(result.warnings[0].code).toBe('sqlserver.identity_downgrade');
        expect(result.unsupportedObjects[0].objectType).toBe('index');
    });

    it('wraps legacy exporters without changing their string output', async () => {
        const diagram = createDiagram(DatabaseType.MYSQL);
        const exporter: SchemaExporter<{ diagram: Diagram }> =
            wrapLegacySchemaExporter({
                targetDialect: DatabaseType.MYSQL,
                exportDiagram: async ({ diagram }) =>
                    `-- ${diagram.name}\nCREATE TABLE users (id int);`,
            });

        const result = await exporter.exportSchema({ diagram });

        expect(result.output).toContain('CREATE TABLE users');
        expect(result.targetDialect).toBe(DatabaseType.MYSQL);
        expect(result.riskLevel).toBe('low');
        expect(result.warnings).toEqual([]);
        expect(result.unsupportedObjects).toEqual([]);
    });
});
