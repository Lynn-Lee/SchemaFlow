import type Dexie from 'dexie';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import { determineCardinalities } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';

export const SCHEMAFLOW_SCHEMA_VERSION = 13;

export const SCHEMAFLOW_STORES_BY_VERSION = {
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

export const SCHEMAFLOW_CURRENT_STORES =
    SCHEMAFLOW_STORES_BY_VERSION[SCHEMAFLOW_SCHEMA_VERSION];

export const SCHEMAFLOW_STORE_NAMES = Object.keys(SCHEMAFLOW_CURRENT_STORES);

type LegacyDBFieldType = {
    id: string;
    name: string;
};

type LegacyDBField = {
    type: string | LegacyDBFieldType;
    nullable?: boolean | string;
};

type LegacyDBTable = {
    fields: LegacyDBField[];
};

type LegacyDBRelationship = {
    type?: Parameters<typeof determineCardinalities>[0];
    sourceCardinality?: DBRelationship['sourceCardinality'];
    targetCardinality?: DBRelationship['targetCardinality'];
};

type LegacyDexieModifyRef<T> = {
    value: T;
};

type ConfigMigrationTransaction = {
    table: (name: 'config') => {
        clear: () => unknown;
    };
};

export const migrateV2FieldTypes = (table: LegacyDBTable) => {
    for (const field of table.fields) {
        if (typeof field.type !== 'string') continue;

        field.type = {
            id: field.type.split(' ').join('_'),
            name: field.type,
        };
    }
};

export const migrateV6RelationshipCardinalities = (
    relationship: LegacyDBRelationship,
    ref: LegacyDexieModifyRef<LegacyDBRelationship>
) => {
    const { sourceCardinality, targetCardinality } = determineCardinalities(
        relationship.type ?? 'one_to_one'
    );

    relationship.sourceCardinality = sourceCardinality;
    relationship.targetCardinality = targetCardinality;

    delete ref.value.type;
};

export const migrateV9FieldNullability = (table: LegacyDBTable) => {
    for (const field of table.fields) {
        if (typeof field.nullable === 'string') {
            field.nullable = field.nullable.toLowerCase() === 'true';
        }
    }
};

export const migrateV12ResetConfig = (tx: ConfigMigrationTransaction) => {
    tx.table('config').clear();
};

export const registerSchemaFlowSchemaVersions = <T extends Dexie>(db: T): T => {
    db.version(1).stores(SCHEMAFLOW_STORES_BY_VERSION[1]);

    db.version(2).upgrade((tx) =>
        tx
            .table<DBTable & { diagramId: string }>('db_tables')
            .toCollection()
            .modify(migrateV2FieldTypes)
    );

    db.version(3).stores(SCHEMAFLOW_STORES_BY_VERSION[3]);
    db.version(4).stores(SCHEMAFLOW_STORES_BY_VERSION[4]);
    db.version(5).stores(SCHEMAFLOW_STORES_BY_VERSION[5]);

    db.version(6).upgrade((tx) =>
        tx
            .table<DBRelationship & { diagramId: string }>('db_relationships')
            .toCollection()
            .modify(migrateV6RelationshipCardinalities)
    );

    db.version(7).stores(SCHEMAFLOW_STORES_BY_VERSION[7]);
    db.version(8).stores(SCHEMAFLOW_STORES_BY_VERSION[8]);

    db.version(9).upgrade((tx) =>
        tx
            .table<DBTable & { diagramId: string }>('db_tables')
            .toCollection()
            .modify(migrateV9FieldNullability)
    );

    db.version(10).stores(SCHEMAFLOW_STORES_BY_VERSION[10]);
    db.version(11).stores(SCHEMAFLOW_STORES_BY_VERSION[11]);
    db.version(12)
        .stores(SCHEMAFLOW_STORES_BY_VERSION[12])
        .upgrade(migrateV12ResetConfig);
    db.version(SCHEMAFLOW_SCHEMA_VERSION).stores(SCHEMAFLOW_CURRENT_STORES);

    return db;
};
