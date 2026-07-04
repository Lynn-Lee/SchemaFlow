import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';
import {
    CURRENT_CHARTDB_BACKUP_FORMAT_VERSION,
    createChartDBBackup,
    parseBackupSummary,
    parseChartDBBackup,
    restoreDiagramFromBackup,
} from '@/storage/backup';

const createDiagram = (overrides: Partial<Diagram> = {}): Diagram => ({
    id: 'diagram-1',
    name: 'Storefront',
    databaseType: DatabaseType.POSTGRESQL,
    createdAt: new Date('2026-07-01T10:00:00.000Z'),
    updatedAt: new Date('2026-07-01T10:05:00.000Z'),
    tables: [
        {
            id: 'table-1',
            name: 'customers',
            x: 10,
            y: 20,
            fields: [],
            indexes: [],
            color: '#f8fafc',
            isView: false,
            createdAt: 1782938400000,
        },
    ],
    relationships: [],
    dependencies: [],
    areas: [],
    customTypes: [],
    notes: [],
    ...overrides,
});

describe('ChartDB backup restore format', () => {
    it('exports a versioned backup with metadata and diagram count', () => {
        const backup = createChartDBBackup({
            diagrams: [createDiagram()],
            now: new Date('2026-07-01T12:00:00.000Z'),
            appVersion: '1.20.1-test',
        });

        expect(backup.format).toBe('chartdb.backup');
        expect(backup.schemaVersion).toBe(
            CURRENT_CHARTDB_BACKUP_FORMAT_VERSION
        );
        expect(backup.createdAt).toBe('2026-07-01T12:00:00.000Z');
        expect(backup.appVersion).toBe('1.20.1-test');
        expect(backup.diagramCount).toBe(1);
        expect(backup.diagrams).toHaveLength(1);
    });

    it('restores a new diagram from a valid backup', () => {
        const backup = createChartDBBackup({
            diagrams: [createDiagram()],
            now: new Date('2026-07-01T12:00:00.000Z'),
            appVersion: '1.20.1-test',
        });

        const restored = restoreDiagramFromBackup({
            backup,
            diagramIndex: 0,
            now: new Date('2026-07-01T12:30:00.000Z'),
        });

        expect(restored.id).not.toBe('diagram-1');
        expect(restored.name).toBe('Storefront');
        expect(restored.createdAt).toEqual(
            new Date('2026-07-01T12:30:00.000Z')
        );
        expect(restored.updatedAt).toEqual(
            new Date('2026-07-01T12:30:00.000Z')
        );
        expect(restored.tables).toHaveLength(1);
    });

    it('builds a restore preview summary without restoring diagrams', () => {
        const backup = createChartDBBackup({
            diagrams: [
                createDiagram(),
                createDiagram({
                    id: 'diagram-2',
                    name: 'Warehouse',
                    tables: [
                        {
                            id: 'table-2',
                            name: 'inventory',
                            x: 0,
                            y: 0,
                            fields: [
                                {
                                    id: 'field-1',
                                    name: 'id',
                                    type: { id: 'int', name: 'int' },
                                    primaryKey: true,
                                    unique: false,
                                    nullable: false,
                                    createdAt: 1782938400000,
                                },
                            ],
                            indexes: [],
                            color: '#f8fafc',
                            isView: false,
                            createdAt: 1782938400000,
                        },
                        {
                            id: 'table-3',
                            name: 'shipments',
                            x: 120,
                            y: 0,
                            fields: [
                                {
                                    id: 'field-2',
                                    name: 'inventory_id',
                                    type: { id: 'int', name: 'int' },
                                    primaryKey: false,
                                    unique: false,
                                    nullable: false,
                                    createdAt: 1782938400000,
                                },
                            ],
                            indexes: [],
                            color: '#f8fafc',
                            isView: false,
                            createdAt: 1782938400000,
                        },
                    ],
                    relationships: [
                        {
                            id: 'relationship-1',
                            name: 'inventory_shipments',
                            sourceTableId: 'table-2',
                            targetTableId: 'table-3',
                            sourceFieldId: 'field-1',
                            targetFieldId: 'field-2',
                            sourceCardinality: 'one',
                            targetCardinality: 'many',
                            createdAt: 1782938400000,
                        },
                    ],
                }),
            ],
            now: new Date('2026-07-01T12:00:00.000Z'),
            appVersion: '1.20.1-test',
        });

        const summary = parseBackupSummary(JSON.stringify(backup));

        expect(summary.diagramCount).toBe(2);
        expect(summary.diagrams).toEqual([
            {
                name: 'Storefront',
                tableCount: 1,
                relationshipCount: 0,
            },
            {
                name: 'Warehouse',
                tableCount: 2,
                relationshipCount: 1,
            },
        ]);
    });

    it('rejects incompatible backup format before restore', () => {
        const parse = () =>
            parseChartDBBackup(
                JSON.stringify({
                    format: 'chartdb.backup',
                    schemaVersion: 999,
                    createdAt: '2026-07-01T12:00:00.000Z',
                    diagramCount: 0,
                    diagrams: [],
                })
            );

        expect(parse).toThrow(/unsupported backup schema version/i);
    });

    it('rejects backup files whose diagram count does not match payload', () => {
        const parse = () =>
            parseChartDBBackup(
                JSON.stringify({
                    format: 'chartdb.backup',
                    schemaVersion: CURRENT_CHARTDB_BACKUP_FORMAT_VERSION,
                    createdAt: '2026-07-01T12:00:00.000Z',
                    diagramCount: 2,
                    diagrams: [createDiagram()],
                })
            );

        expect(parse).toThrow(/diagram count/i);
    });
});
