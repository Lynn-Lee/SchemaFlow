import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaFlowContextDir = path.resolve(
    process.cwd(),
    'src/context/schemaflow-context'
);

describe('SchemaFlowProvider structure', () => {
    it('keeps the provider shell small and moves implementation into hooks', () => {
        const providerPath = path.join(
            schemaFlowContextDir,
            'schemaflow-provider.tsx'
        );
        const providerSource = fs.readFileSync(providerPath, 'utf8');
        const providerLines = providerSource.split('\n').length;

        expect(providerLines).toBeLessThanOrEqual(800);
        expect(providerSource).toContain('useSchemaFlowProviderValue');

        const hookPath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        expect(fs.existsSync(hookPath)).toBe(true);
    });

    it('moves dependency operations into a domain hook', () => {
        const hookPath = path.join(
            schemaFlowContextDir,
            'use-dependency-operations.ts'
        );
        expect(fs.existsSync(hookPath)).toBe(true);

        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain('useDependencyOperations');
        expect(providerValueSource).not.toContain('const createDependency');
        expect(providerValueSource).not.toContain('const updateDependency');
    });

    it('moves visual and custom type operations into a domain hook', () => {
        const hookPath = path.join(
            schemaFlowContextDir,
            'use-visual-operations.ts'
        );
        expect(fs.existsSync(hookPath)).toBe(true);

        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain('useVisualOperations');
        expect(providerValueSource).not.toContain('const createArea');
        expect(providerValueSource).not.toContain('const updateArea');
        expect(providerValueSource).not.toContain('const createNote');
        expect(providerValueSource).not.toContain('const updateNote');
        expect(providerValueSource).not.toContain('const createCustomType');
        expect(providerValueSource).not.toContain('const updateCustomType');
    });

    it('moves table and field operations into a domain hook', () => {
        const hookPath = path.join(
            schemaFlowContextDir,
            'use-table-field-operations.ts'
        );
        expect(fs.existsSync(hookPath)).toBe(true);

        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain('useTableFieldOperations');
        expect(providerValueSource).not.toContain('const createTable');
        expect(providerValueSource).not.toContain('const updateTable');
        expect(providerValueSource).not.toContain('const updateTablesState');
        expect(providerValueSource).not.toContain('const createField');
        expect(providerValueSource).not.toContain('const updateField');
    });

    it('moves relationship and check constraint operations into a domain hook', () => {
        const hookPath = path.join(
            schemaFlowContextDir,
            'use-relationship-constraint-operations.ts'
        );
        expect(fs.existsSync(hookPath)).toBe(true);

        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain(
            'useRelationshipConstraintOperations'
        );
        expect(providerValueSource).not.toContain('const createRelationship');
        expect(providerValueSource).not.toContain('const updateRelationship');
        expect(providerValueSource).not.toContain(
            'const createCheckConstraint'
        );
        expect(providerValueSource).not.toContain(
            'const updateCheckConstraint'
        );
    });

    it('moves index operations into a domain hook', () => {
        const hookPath = path.join(
            schemaFlowContextDir,
            'use-index-operations.ts'
        );
        expect(fs.existsSync(hookPath)).toBe(true);

        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain('useIndexOperations');
        expect(providerValueSource).not.toContain('const createIndex');
        expect(providerValueSource).not.toContain('const updateIndex');
        expect(providerValueSource).not.toContain('const getIndex');
    });

    it('routes diff merge and diagram load through schema-core diagram commands', () => {
        const providerValuePath = path.join(
            schemaFlowContextDir,
            'use-schemaflow-provider-value.tsx'
        );
        const providerValueSource = fs.readFileSync(providerValuePath, 'utf8');

        expect(providerValueSource).toContain('applyDiagramCommand');
        expect(providerValueSource).toContain('createMergeDiagramDiffCommand');
        expect(providerValueSource).toContain('createReplaceDiagramCommand');
    });
});
