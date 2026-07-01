import { describe, expect, it } from 'vitest';
import {
    CHARTDB_DATABASE_NAME,
    CHARTDB_SCHEMA_VERSION,
    CHARTDB_STORE_NAMES,
    createChartDBDexie,
} from '../chartdb-dexie';

describe('ChartDB Dexie database definition', () => {
    it('centralizes the current database name and schema version', () => {
        expect(CHARTDB_DATABASE_NAME).toBe('ChartDB');
        expect(CHARTDB_SCHEMA_VERSION).toBe(13);
    });

    it('creates the current Dexie tables from the centralized schema', () => {
        const db = createChartDBDexie();

        expect(db.name).toBe(CHARTDB_DATABASE_NAME);
        expect(db.verno).toBe(CHARTDB_SCHEMA_VERSION);
        expect(db.tables.map((table) => table.name).sort()).toEqual(
            [...CHARTDB_STORE_NAMES].sort()
        );

        db.close();
    });

    it('keeps every current store declaration centralized', () => {
        expect(CHARTDB_STORE_NAMES).toEqual([
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
