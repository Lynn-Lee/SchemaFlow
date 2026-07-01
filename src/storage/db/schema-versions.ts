import type Dexie from 'dexie';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import { determineCardinalities } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';

export const CHARTDB_SCHEMA_VERSION = 13;

export const CHARTDB_STORES_BY_VERSION = {
    1: {
        diagrams: '++id, name, databaseType, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, x, y, fields, indexes, color, createdAt, width',
        db_relationships:
            '++id, diagramId, name, sourceTableId, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        config: '++id, defaultDiagramId',
    },
    3: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, x, y, fields, indexes, color, createdAt, width',
        db_relationships:
            '++id, diagramId, name, sourceTableId, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        config: '++id, defaultDiagramId',
    },
    4: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, x, y, fields, indexes, color, createdAt, width, comment',
        db_relationships:
            '++id, diagramId, name, sourceTableId, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        config: '++id, defaultDiagramId',
    },
    5: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        config: '++id, defaultDiagramId',
    },
    7: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        config: '++id, defaultDiagramId',
    },
    8: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment, isView, isMaterializedView, order',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        config: '++id, defaultDiagramId',
    },
    10: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment, isView, isMaterializedView, order',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        areas: '++id, diagramId, name, x, y, width, height, color',
        config: '++id, defaultDiagramId',
    },
    11: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment, isView, isMaterializedView, order',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        areas: '++id, diagramId, name, x, y, width, height, color',
        db_custom_types: '++id, diagramId, schema, type, kind, values, fields',
        config: '++id, defaultDiagramId',
    },
    12: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment, isView, isMaterializedView, order',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        areas: '++id, diagramId, name, x, y, width, height, color',
        db_custom_types: '++id, diagramId, schema, type, kind, values, fields',
        config: '++id, defaultDiagramId',
        diagram_filters: 'diagramId, tableIds, schemasIds',
    },
    13: {
        diagrams:
            '++id, name, databaseType, databaseEdition, createdAt, updatedAt',
        db_tables:
            '++id, diagramId, name, schema, x, y, fields, indexes, color, createdAt, width, comment, isView, isMaterializedView, order',
        db_relationships:
            '++id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId, sourceFieldId, targetFieldId, type, createdAt',
        db_dependencies:
            '++id, diagramId, schema, tableId, dependentSchema, dependentTableId, createdAt',
        areas: '++id, diagramId, name, x, y, width, height, color',
        db_custom_types: '++id, diagramId, schema, type, kind, values, fields',
        config: '++id, defaultDiagramId',
        diagram_filters: 'diagramId, tableIds, schemasIds',
        notes: '++id, diagramId, content, x, y, width, height, color',
    },
} as const;

export const CHARTDB_CURRENT_STORES =
    CHARTDB_STORES_BY_VERSION[CHARTDB_SCHEMA_VERSION];

export const CHARTDB_STORE_NAMES = Object.keys(CHARTDB_CURRENT_STORES);

export const registerChartDBSchemaVersions = <T extends Dexie>(db: T): T => {
    db.version(1).stores(CHARTDB_STORES_BY_VERSION[1]);

    db.version(2).upgrade((tx) =>
        tx
            .table<DBTable & { diagramId: string }>('db_tables')
            .toCollection()
            .modify((table) => {
                for (const field of table.fields) {
                    field.type = {
                        // @ts-expect-error string before
                        id: (field.type as string).split(' ').join('_'),
                        // @ts-expect-error string before
                        name: field.type,
                    };
                }
            })
    );

    db.version(3).stores(CHARTDB_STORES_BY_VERSION[3]);
    db.version(4).stores(CHARTDB_STORES_BY_VERSION[4]);
    db.version(5).stores(CHARTDB_STORES_BY_VERSION[5]);

    db.version(6).upgrade((tx) =>
        tx
            .table<DBRelationship & { diagramId: string }>('db_relationships')
            .toCollection()
            .modify((relationship, ref) => {
                const { sourceCardinality, targetCardinality } =
                    determineCardinalities(
                        // @ts-expect-error string before
                        relationship.type ?? 'one_to_one'
                    );

                relationship.sourceCardinality = sourceCardinality;
                relationship.targetCardinality = targetCardinality;

                // @ts-expect-error string before
                delete ref.value.type;
            })
    );

    db.version(7).stores(CHARTDB_STORES_BY_VERSION[7]);
    db.version(8).stores(CHARTDB_STORES_BY_VERSION[8]);

    db.version(9).upgrade((tx) =>
        tx
            .table<DBTable & { diagramId: string }>('db_tables')
            .toCollection()
            .modify((table) => {
                for (const field of table.fields) {
                    if (typeof field.nullable === 'string') {
                        field.nullable =
                            (field.nullable as string).toLowerCase() === 'true';
                    }
                }
            })
    );

    db.version(10).stores(CHARTDB_STORES_BY_VERSION[10]);
    db.version(11).stores(CHARTDB_STORES_BY_VERSION[11]);
    db.version(12)
        .stores(CHARTDB_STORES_BY_VERSION[12])
        .upgrade((tx) => {
            tx.table('config').clear();
        });
    db.version(CHARTDB_SCHEMA_VERSION).stores(CHARTDB_CURRENT_STORES);

    return db;
};
