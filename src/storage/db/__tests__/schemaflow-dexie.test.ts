import { describe, expect, it } from 'vitest';
import {
    SCHEMAFLOW_DATABASE_NAME,
    SCHEMAFLOW_SCHEMA_VERSION,
    SCHEMAFLOW_STORE_NAMES,
    createSchemaFlowDexie,
} from '../schemaflow-dexie';

describe('SchemaFlow Dexie database definition', () => {
    it('centralizes the current database name and schema version', () => {
        expect(SCHEMAFLOW_DATABASE_NAME).toBe('SchemaFlow');
        expect(SCHEMAFLOW_SCHEMA_VERSION).toBe(13);
    });

    it('creates the current Dexie tables from the centralized schema', () => {
        const db = createSchemaFlowDexie();

        expect(db.name).toBe(SCHEMAFLOW_DATABASE_NAME);
        expect(db.verno).toBe(SCHEMAFLOW_SCHEMA_VERSION);
        expect(db.tables.map((table) => table.name).sort()).toEqual(
            [...SCHEMAFLOW_STORE_NAMES].sort()
        );

        db.close();
    });

    it('keeps every current store declaration centralized', () => {
        expect(SCHEMAFLOW_STORE_NAMES).toEqual([
            'diagrams',
            'db_tables',
            'db_relationships',
            'db_dependencies',
            'areas',
            'db_custom_types',
            'config',
            'diagram_filters',
            'notes',
        ]);
    });
});
