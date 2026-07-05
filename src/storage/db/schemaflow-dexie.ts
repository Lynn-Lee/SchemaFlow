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

export const createSchemaFlowDexie = (): SchemaFlowDexie => {
    const db = registerSchemaFlowSchemaVersions(
        new Dexie(SCHEMAFLOW_DATABASE_NAME) as SchemaFlowDexie
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
