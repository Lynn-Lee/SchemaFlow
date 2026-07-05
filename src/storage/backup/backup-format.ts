import { z } from 'zod';
import { cloneDiagram } from '@/lib/clone';
import { diagramSchema, type Diagram } from '@/lib/domain/diagram';
import { generateDiagramId } from '@/lib/browser-utils';

export const CHARTDB_BACKUP_FORMAT = 'chartdb.backup';
export const CURRENT_CHARTDB_BACKUP_FORMAT_VERSION = 1;

export type ChartDBBackupV1 = {
    format: typeof CHARTDB_BACKUP_FORMAT;
    schemaVersion: typeof CURRENT_CHARTDB_BACKUP_FORMAT_VERSION;
    createdAt: string;
    source: 'chartdb-local';
    appVersion?: string;
    diagramCount: number;
    diagrams: Diagram[];
};

export type ChartDBBackupDiagramSummary = {
    name: string;
    tableCount: number;
    relationshipCount: number;
};

export type ChartDBBackupSummary = {
    format: typeof CHARTDB_BACKUP_FORMAT;
    schemaVersion: typeof CURRENT_CHARTDB_BACKUP_FORMAT_VERSION;
    createdAt: string;
    source: 'chartdb-local';
    appVersion?: string;
    diagramCount: number;
    diagrams: ChartDBBackupDiagramSummary[];
};

type CreateBackupInput = {
    diagrams: Diagram[];
    now?: Date;
    appVersion?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const parseDate = (value: unknown): Date => {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid backup diagram date');
    }

    return date;
};

const parseDiagram = (value: unknown): Diagram => {
    if (!isRecord(value)) {
        throw new Error('Invalid backup diagram payload');
    }

    return diagramSchema.parse({
        ...value,
        createdAt: parseDate(value.createdAt),
        updatedAt: parseDate(value.updatedAt),
    });
};

const parseDiagramSummary = (value: unknown): ChartDBBackupDiagramSummary => {
    if (!isRecord(value)) {
        throw new Error('Invalid backup diagram payload');
    }

    return {
        name: typeof value.name === 'string' ? value.name : 'Untitled diagram',
        tableCount: Array.isArray(value.tables) ? value.tables.length : 0,
        relationshipCount: Array.isArray(value.relationships)
            ? value.relationships.length
            : 0,
    };
};

const rawBackupSchema = z.object({
    format: z.literal(CHARTDB_BACKUP_FORMAT),
    schemaVersion: z.number(),
    createdAt: z.string().datetime(),
    source: z.literal('chartdb-local').optional(),
    appVersion: z.string().optional(),
    diagramCount: z.number().int().nonnegative(),
    diagrams: z.array(z.unknown()),
});

export function createChartDBBackup({
    diagrams,
    now = new Date(),
    appVersion,
}: CreateBackupInput): ChartDBBackupV1 {
    return {
        format: CHARTDB_BACKUP_FORMAT,
        schemaVersion: CURRENT_CHARTDB_BACKUP_FORMAT_VERSION,
        createdAt: now.toISOString(),
        source: 'chartdb-local',
        appVersion,
        diagramCount: diagrams.length,
        diagrams: diagrams.map((diagram) => cloneDiagram(diagram).diagram),
    };
}

export function parseBackupSummary(json: string): ChartDBBackupSummary {
    let parsed: unknown;

    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('Invalid backup JSON');
    }

    const raw = rawBackupSchema.safeParse(parsed);

    if (!raw.success) {
        throw new Error('Invalid ChartDB backup file');
    }

    if (raw.data.schemaVersion !== CURRENT_CHARTDB_BACKUP_FORMAT_VERSION) {
        throw new Error(
            `Unsupported backup schema version: ${raw.data.schemaVersion}`
        );
    }

    if (raw.data.diagramCount !== raw.data.diagrams.length) {
        throw new Error('Backup diagram count does not match payload');
    }

    return {
        format: raw.data.format,
        schemaVersion: CURRENT_CHARTDB_BACKUP_FORMAT_VERSION,
        createdAt: raw.data.createdAt,
        source: raw.data.source ?? 'chartdb-local',
        appVersion: raw.data.appVersion,
        diagramCount: raw.data.diagramCount,
        diagrams: raw.data.diagrams.map(parseDiagramSummary),
    };
}

export function parseChartDBBackup(json: string): ChartDBBackupV1 {
    let parsed: unknown;

    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('Invalid backup JSON');
    }

    const raw = rawBackupSchema.safeParse(parsed);

    if (!raw.success) {
        throw new Error('Invalid ChartDB backup file');
    }

    if (raw.data.schemaVersion !== CURRENT_CHARTDB_BACKUP_FORMAT_VERSION) {
        throw new Error(
            `Unsupported backup schema version: ${raw.data.schemaVersion}`
        );
    }

    if (raw.data.diagramCount !== raw.data.diagrams.length) {
        throw new Error('Backup diagram count does not match payload');
    }

    return {
        format: raw.data.format,
        schemaVersion: CURRENT_CHARTDB_BACKUP_FORMAT_VERSION,
        createdAt: raw.data.createdAt,
        source: raw.data.source ?? 'chartdb-local',
        appVersion: raw.data.appVersion,
        diagramCount: raw.data.diagramCount,
        diagrams: raw.data.diagrams.map(parseDiagram),
    };
}

export function restoreDiagramFromBackup({
    backup,
    diagramIndex = 0,
    now = new Date(),
}: {
    backup: ChartDBBackupV1;
    diagramIndex?: number;
    now?: Date;
}): Diagram {
    const diagram = backup.diagrams[diagramIndex];

    if (!diagram) {
        throw new Error(`Backup diagram index ${diagramIndex} does not exist`);
    }

    return {
        ...cloneDiagram(diagram, { generateId: generateDiagramId }).diagram,
        createdAt: now,
        updatedAt: now,
    };
}
