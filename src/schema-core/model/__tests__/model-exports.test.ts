import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
    areaSchema,
    DatabaseType,
    dbFieldSchema,
    dbIndexSchema,
    dbRelationshipSchema,
    dbTableSchema,
    CURRENT_DIAGRAM_VERSION,
    diagramSchema,
    noteSchema,
    type Diagram,
} from '@/schema-core/model';

describe('schema-core model exports', () => {
    it('exposes the existing diagram domain model through the schema-core entrypoint', () => {
        const createdAt = new Date('2026-07-01T00:00:00.000Z');
        const diagram: Diagram = {
            id: 'diagram-1',
            name: 'Example diagram',
            databaseType: DatabaseType.POSTGRESQL,
            tables: [],
            relationships: [],
            areas: [],
            notes: [],
            createdAt,
            updatedAt: createdAt,
        };

        expect(diagramSchema.parse(diagram)).toEqual({
            ...diagram,
            version: CURRENT_DIAGRAM_VERSION,
        });
        expect(
            dbFieldSchema.safeParse({
                id: 'field-1',
                name: 'id',
                type: { id: 'integer', name: 'integer' },
                primaryKey: true,
                unique: true,
                nullable: false,
                createdAt: 1,
            }).success
        ).toBe(true);
        expect(
            dbIndexSchema.safeParse({
                id: 'index-1',
                name: 'users_pkey',
                unique: true,
                fieldIds: ['field-1'],
                createdAt: 1,
            }).success
        ).toBe(true);
        expect(
            dbRelationshipSchema.safeParse({
                id: 'relationship-1',
                name: 'users_org_id_fk',
                sourceTableId: 'users',
                targetTableId: 'organizations',
                sourceFieldId: 'org_id',
                targetFieldId: 'id',
                sourceCardinality: 'many',
                targetCardinality: 'one',
                createdAt: 1,
            }).success
        ).toBe(true);
        expect(
            dbTableSchema.safeParse({
                id: 'table-1',
                name: 'users',
                x: 0,
                y: 0,
                fields: [],
                indexes: [],
                color: '#ffffff',
                isView: false,
                createdAt: 1,
            }).success
        ).toBe(true);
        expect(
            areaSchema.safeParse({
                id: 'area-1',
                name: 'Core',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                color: '#ffffff',
            }).success
        ).toBe(true);
        expect(
            noteSchema.safeParse({
                id: 'note-1',
                content: 'Review indexes',
                x: 0,
                y: 0,
                width: 200,
                height: 120,
                color: '#ffffff',
            }).success
        ).toBe(true);
    });

    it('keeps schema-core model files free of UI, storage, editor, and browser imports', () => {
        const schemaCoreRoot = join(process.cwd(), 'src/schema-core');
        const forbiddenPatterns = [
            /from ['"]react(?:\/|['"])/,
            /from ['"]dexie['"]/,
            /from ['"]@monaco-editor\/react['"]/,
            /from ['"]monaco-editor['"]/,
            /\bwindow\./,
            /\bdocument\./,
            /\blocalStorage\b/,
            /\bsessionStorage\b/,
        ];

        const sourceFiles = collectSourceFiles(schemaCoreRoot);
        expect(sourceFiles.length).toBeGreaterThan(0);

        for (const filePath of sourceFiles) {
            const source = readFileSync(filePath, 'utf8');
            for (const pattern of forbiddenPatterns) {
                expect(
                    pattern.test(source),
                    `${filePath} should not match ${pattern}`
                ).toBe(false);
            }
        }
    });

    it('keeps schema-core model definitions in schema-core instead of re-exporting lib/domain', () => {
        const modelRoot = join(process.cwd(), 'src/schema-core/model');
        const sourceFiles = collectSourceFiles(modelRoot);

        expect(sourceFiles.length).toBeGreaterThan(0);

        for (const filePath of sourceFiles) {
            const source = readFileSync(filePath, 'utf8');

            expect(
                source.includes('@/lib/domain'),
                `${filePath} should own model definitions instead of re-exporting lib/domain`
            ).toBe(false);
        }
    });
});

function collectSourceFiles(root: string): string[] {
    return readdirSync(root).flatMap((entry) => {
        const fullPath = join(root, entry);
        if (fullPath.includes(`${join('__tests__')}`)) {
            return [];
        }
        if (statSync(fullPath).isDirectory()) {
            return collectSourceFiles(fullPath);
        }
        return fullPath.endsWith('.ts') ? [fullPath] : [];
    });
}
