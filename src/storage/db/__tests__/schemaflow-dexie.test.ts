import { describe, expect, it } from 'vitest';
import {
    LEGACY_CHARTDB_DATABASE_NAME,
    SCHEMAFLOW_DATABASE_NAME,
    SCHEMAFLOW_SCHEMA_VERSION,
    SCHEMAFLOW_STORE_NAMES,
    createSchemaFlowDexie,
    migrateLegacyChartDBStores,
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

    it('copies rows from a legacy ChartDB database into an empty SchemaFlow database', async () => {
        const legacyRows = [{ id: 'diagram-1', name: 'Legacy diagram' }];
        const copiedRows: unknown[] = [];

        const legacyDb = {
            table: () => ({
                toArray: async () => legacyRows,
            }),
        };
        const schemaFlowDb = {
            table: () => ({
                count: async () => 0,
                bulkPut: async (rows: unknown[]) => {
                    copiedRows.push(...rows);
                },
            }),
        };

        await migrateLegacyChartDBStores({
            legacyDb,
            schemaFlowDb,
            storeNames: ['diagrams'],
        });

        expect(LEGACY_CHARTDB_DATABASE_NAME).toBe('ChartDB');
        expect(copiedRows).toEqual(legacyRows);
    });
});
