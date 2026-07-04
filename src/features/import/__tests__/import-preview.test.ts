import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { ImportResult } from '@/dialects/common';
import { DBCustomTypeKind } from '@/lib/domain/db-custom-type';
import { buildImportPreview } from '../import-preview';

describe('buildImportPreview', () => {
    it('summarizes import objects and dialect warnings before data is written', () => {
        const result: ImportResult = {
            sourceDialect: DatabaseType.POSTGRESQL,
            confidence: 'medium',
            diagram: {
                id: 'preview',
                name: 'Preview',
                databaseType: DatabaseType.POSTGRESQL,
                createdAt: new Date('2026-07-01T00:00:00Z'),
                updatedAt: new Date('2026-07-01T00:00:00Z'),
                tables: [
                    {
                        id: 'users',
                        name: 'users',
                        x: 0,
                        y: 0,
                        fields: [],
                        indexes: [],
                        color: '#fff',
                        isView: false,
                        createdAt: 1,
                    },
                ],
                relationships: [
                    {
                        id: 'user_posts',
                        name: 'user_posts',
                        sourceTableId: 'users',
                        targetTableId: 'posts',
                        sourceFieldId: 'id',
                        targetFieldId: 'user_id',
                        sourceCardinality: 'one',
                        targetCardinality: 'many',
                        createdAt: 1,
                    },
                ],
                customTypes: [
                    {
                        id: 'status',
                        name: 'status',
                        kind: DBCustomTypeKind.enum,
                        values: ['active', 'disabled'],
                    },
                ],
            },
            diagnostics: [],
            warnings: [
                {
                    code: 'postgresql.policy_unsupported',
                    severity: 'warning',
                    message: 'Policy was ignored.',
                    sourceRange: { startLine: 12, endLine: 12 },
                },
            ],
            unsupportedObjects: [
                {
                    objectType: 'policy',
                    name: 'users_rls',
                    reason: 'RLS policy is not represented in ChartDB.',
                    ignored: true,
                },
            ],
            sourceMap: {},
        };

        expect(buildImportPreview(result)).toEqual({
            sourceDialect: DatabaseType.POSTGRESQL,
            confidence: 'medium',
            counts: {
                tables: 1,
                relationships: 1,
                customTypes: 1,
                warnings: 1,
                unsupportedObjects: 1,
            },
            diagnostics: [],
            warnings: [
                {
                    code: 'postgresql.policy_unsupported',
                    severity: 'warning',
                    message: 'Policy was ignored.',
                    location: 'line 12',
                },
            ],
            unsupportedObjects: [
                {
                    objectType: 'policy',
                    name: 'users_rls',
                    reason: 'RLS policy is not represented in ChartDB.',
                    ignored: true,
                },
            ],
            hasImportableObjects: true,
        });
    });
});
