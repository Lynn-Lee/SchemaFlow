import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { diagramFromJSONInput } from '@/lib/export-import-utils';
import { CURRENT_DIAGRAM_VERSION } from '@/schema-core/model/diagram';

const createLegacyDiagramJson = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
        id: 'legacy-diagram',
        name: 'Legacy diagram',
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        relationships: [],
        dependencies: [],
        areas: [],
        customTypes: [],
        notes: [],
        ...overrides,
    });

describe('diagramFromJSONInput', () => {
    it('migrates legacy diagrams without a version to the current version', () => {
        const diagram = diagramFromJSONInput(createLegacyDiagramJson());

        expect(CURRENT_DIAGRAM_VERSION).toBe(1);
        expect(diagram.version).toBe(CURRENT_DIAGRAM_VERSION);
    });

    it('rejects diagrams from unsupported future versions with a readable error', () => {
        const parse = () =>
            diagramFromJSONInput(
                createLegacyDiagramJson({
                    version: CURRENT_DIAGRAM_VERSION + 1,
                })
            );

        expect(parse).toThrow(
            `Unsupported diagram version: detected ${
                CURRENT_DIAGRAM_VERSION + 1
            }, expected ${CURRENT_DIAGRAM_VERSION}`
        );
    });
});
