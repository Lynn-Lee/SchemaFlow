import Dexie, { type EntityTable } from 'dexie';
import type { Area } from '@/lib/domain/area';
import type { SchemaFlowConfig } from '@/lib/domain/config';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Diagram } from '@/lib/domain/diagram';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import type { Note } from '@/lib/domain/note';
import {
    SCHEMAFLOW_SCHEMA_VERSION,
    SCHEMAFLOW_STORE_NAMES,
    registerSchemaFlowSchemaVersions,
} from './schema-versions';

export { SCHEMAFLOW_SCHEMA_VERSION, SCHEMAFLOW_STORE_NAMES };

export const SCHEMAFLOW_DATABASE_NAME = 'SchemaFlow';
export const LEGACY_CHARTDB_DATABASE_NAME = 'ChartDB';

export type SchemaFlowDexie = Dexie & {
    diagrams: EntityTable<Diagram, 'id'>;
    db_tables: EntityTable<DBTable & { diagramId: string }, 'id'>;
    db_relationships: EntityTable<DBRelationship & { diagramId: string }, 'id'>;
    db_dependencies: EntityTable<DBDependency & { diagramId: string }, 'id'>;
    areas: EntityTable<Area & { diagramId: string }, 'id'>;
    db_custom_types: EntityTable<DBCustomType & { diagramId: string }, 'id'>;
    notes: EntityTable<Note & { diagramId: string }, 'id'>;
    config: EntityTable<SchemaFlowConfig & { id: number }, 'id'>;
    diagram_filters: EntityTable<
        DiagramFilter & { diagramId: string },
        'diagramId'
    >;
};

type LegacyMigrationTable = {
    count?: () => Promise<number>;
    toArray?: () => Promise<unknown[]>;
    bulkPut?: (rows: unknown[]) => Promise<unknown>;
};

type LegacyMigrationDb = {
    table: (name: string) => LegacyMigrationTable;
};

type LegacyMigrationInput = {
    legacyDb: LegacyMigrationDb;
    schemaFlowDb: LegacyMigrationDb;
    storeNames: readonly string[];
    runInTransaction?: (callback: () => Promise<void>) => Promise<unknown>;
};

export const migrateLegacyChartDBStores = async ({
    legacyDb,
    schemaFlowDb,
    storeNames,
    runInTransaction,
}: LegacyMigrationInput) => {
    const targetCounts = await Promise.all(
        storeNames.map(
            (storeName) => schemaFlowDb.table(storeName).count?.() ?? 0
        )
    );

    if (targetCounts.some((count) => count > 0)) {
        return { copied: false };
    }

    const copyStores = async () => {
        for (const storeName of storeNames) {
            const rows = (await legacyDb.table(storeName).toArray?.()) ?? [];
            if (rows.length === 0) continue;

            await schemaFlowDb.table(storeName).bulkPut?.(rows);
        }
    };

    if (runInTransaction) {
        await runInTransaction(copyStores);
    } else {
        await copyStores();
    }

    return { copied: true };
};

const migrateLegacyChartDBDatabase = async (schemaFlowDb: SchemaFlowDexie) => {
    if (!(await Dexie.exists(LEGACY_CHARTDB_DATABASE_NAME))) {
        return;
    }

    const legacyDb = registerSchemaFlowSchemaVersions(
        new Dexie(LEGACY_CHARTDB_DATABASE_NAME) as SchemaFlowDexie
    );

    try {
        await legacyDb.open();
        await migrateLegacyChartDBStores({
            legacyDb,
            schemaFlowDb,
            storeNames: SCHEMAFLOW_STORE_NAMES,
            runInTransaction: (callback) =>
                schemaFlowDb.transaction(
                    'rw',
                    SCHEMAFLOW_STORE_NAMES.map((storeName) =>
                        schemaFlowDb.table(storeName)
                    ),
                    callback
                ),
        });
    } finally {
        legacyDb.close();
    }
};

export const createSchemaFlowDexie = (): SchemaFlowDexie => {
    const db = registerSchemaFlowSchemaVersions(
        new Dexie(SCHEMAFLOW_DATABASE_NAME) as SchemaFlowDexie
    );

    db.on('ready', async () => {
        await migrateLegacyChartDBDatabase(db);

        const config = await db.config.get(1);

        if (!config) {
            const diagrams = await db.diagrams.toArray();

            await db.config.add({
                id: 1,
                defaultDiagramId: diagrams?.[0]?.id ?? '',
            });
        }
    });

    return db;
};
