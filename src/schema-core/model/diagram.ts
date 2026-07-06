import { z } from 'zod';
import { DatabaseEdition } from './database-edition';
import { DatabaseType } from './database-type';
import type { DBDependency } from './dependency';
import { dbDependencySchema } from './dependency';
import type { DBRelationship } from './relationship';
import { dbRelationshipSchema } from './relationship';
import type { DBTable } from './table';
import { dbTableSchema } from './table';
import { areaSchema, type Area } from './area';
import type { DBCustomType } from './custom-type';
import { dbCustomTypeSchema } from './custom-type';
import type { Note } from './note';
import { noteSchema } from './note';

export const CURRENT_DIAGRAM_VERSION = 1;

export interface Diagram {
    id: string;
    version?: typeof CURRENT_DIAGRAM_VERSION;
    name: string;
    databaseType: DatabaseType;
    databaseEdition?: DatabaseEdition;
    tables?: DBTable[];
    relationships?: DBRelationship[];
    dependencies?: DBDependency[];
    areas?: Area[];
    customTypes?: DBCustomType[];
    notes?: Note[];
    createdAt: Date;
    updatedAt: Date;
}

export const diagramSchema: z.ZodType<Diagram> = z.object({
    id: z.string(),
    version: z
        .literal(CURRENT_DIAGRAM_VERSION)
        .default(CURRENT_DIAGRAM_VERSION),
    name: z.string(),
    databaseType: z.nativeEnum(DatabaseType),
    databaseEdition: z.nativeEnum(DatabaseEdition).optional(),
    tables: z.array(dbTableSchema).optional(),
    relationships: z.array(dbRelationshipSchema).optional(),
    dependencies: z.array(dbDependencySchema).optional(),
    areas: z.array(areaSchema).optional(),
    customTypes: z.array(dbCustomTypeSchema).optional(),
    notes: z.array(noteSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
