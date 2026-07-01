import Dexie, { type EntityTable } from 'dexie';
import type { Area } from '@/lib/domain/area';
import type { ChartDBConfig } from '@/lib/domain/config';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Diagram } from '@/lib/domain/diagram';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import type { Note } from '@/lib/domain/note';
import {
    CHARTDB_SCHEMA_VERSION,
    CHARTDB_STORE_NAMES,
    registerChartDBSchemaVersions,
} from './schema-versions';

export { CHARTDB_SCHEMA_VERSION, CHARTDB_STORE_NAMES };

export const CHARTDB_DATABASE_NAME = 'ChartDB';

export type ChartDBDexie = Dexie & {
    diagrams: EntityTable<Diagram, 'id'>;
    db_tables: EntityTable<DBTable & { diagramId: string }, 'id'>;
    db_relationships: EntityTable<DBRelationship & { diagramId: string }, 'id'>;
    db_dependencies: EntityTable<DBDependency & { diagramId: string }, 'id'>;
    areas: EntityTable<Area & { diagramId: string }, 'id'>;
    db_custom_types: EntityTable<DBCustomType & { diagramId: string }, 'id'>;
    notes: EntityTable<Note & { diagramId: string }, 'id'>;
    config: EntityTable<ChartDBConfig & { id: number }, 'id'>;
    diagram_filters: EntityTable<
        DiagramFilter & { diagramId: string },
        'diagramId'
    >;
};

export const createChartDBDexie = (): ChartDBDexie => {
    const db = registerChartDBSchemaVersions(
        new Dexie(CHARTDB_DATABASE_NAME) as ChartDBDexie
    );

    db.on('ready', async () => {
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
