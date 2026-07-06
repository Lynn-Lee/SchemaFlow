import { describe, expect, it } from 'vitest';
import { getCapabilitySupport } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';
import {
    dbmlCapabilities,
    dbmlSchemaExporter,
    dbmlSchemaImporter,
} from '../index';

describe('dbml dialect pipeline', () => {
    it('imports DBML through the unified import result contract with warnings', async () => {
        const result = await dbmlSchemaImporter.importSchema({
            dbml: `
                Table users {
                    id uuid [pk]
                    role varchar
                }

                Table posts {
                    id uuid [pk]
                    user_id uuid
                }

                Ref: posts.user_id > users.id

                TableGroup "Core" {
                    users
                    posts
                }

                Note note_core {
                    'Internal documentation note'
                }
            `,
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(result.sourceDialect).toBe('dbml');
        expect(result.diagram.databaseType).toBe(DatabaseType.POSTGRESQL);
        expect(result.diagram.tables?.map((table) => table.name)).toEqual([
            'users',
            'posts',
        ]);
        expect(result.diagram.relationships).toHaveLength(1);
        expect(result.unsupportedObjects).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    objectType: 'table_group',
                    name: 'Core',
                    ignored: true,
                }),
                expect.objectContaining({
                    objectType: 'note',
                    name: 'note_core',
                    ignored: true,
                }),
            ])
        );
        expect(result.warnings.map((warning) => warning.code)).toEqual(
            expect.arrayContaining([
                'dbml.table_group_unsupported',
                'dbml.note_unsupported',
            ])
        );
    });

    it('exports DBML through the unified export result contract with skipped object warnings', async () => {
        const imported = await dbmlSchemaImporter.importSchema({
            dbml: `
                Table users {
                    id uuid [pk]
                    email varchar
                }
            `,
            databaseType: DatabaseType.POSTGRESQL,
        });

        const result = await dbmlSchemaExporter.exportSchema({
            diagram: {
                ...imported.diagram,
                tables: [
                    ...(imported.diagram.tables ?? []),
                    {
                        id: 'empty-table',
                        name: 'empty_table',
                        fields: [],
                        indexes: [],
                        x: 0,
                        y: 0,
                        color: '#ffffff',
                        isView: false,
                        createdAt: Date.now(),
                    },
                ],
            },
        });

        expect(result.targetDialect).toBe('dbml');
        expect(result.output).toContain('"users"');
        expect(result.riskLevel).toBe('medium');
        expect(result.unsupportedObjects).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    objectType: 'table',
                    name: 'empty_table',
                    ignored: true,
                }),
            ])
        );
        expect(result.warnings.map((warning) => warning.code)).toContain(
            'dbml.empty_table_skipped'
        );
    });

    it('declares DBML import and export capability levels', () => {
        expect(getCapabilitySupport(dbmlCapabilities, 'import', 'tables')).toBe(
            'full'
        );
        expect(
            getCapabilitySupport(dbmlCapabilities, 'export', 'relationships')
        ).toBe('full');
        expect(getCapabilitySupport(dbmlCapabilities, 'import', 'views')).toBe(
            'unsupported'
        );
        expect(dbmlCapabilities.unsupportedSyntax).toContain('TableGroup');
    });
});
