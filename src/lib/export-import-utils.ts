import { cloneDiagram } from './clone';
import {
    CURRENT_DIAGRAM_VERSION,
    diagramSchema,
    type Diagram,
} from './domain/diagram';
import { generateDiagramId } from './browser-utils';
import {
    SCHEMAFLOW_BACKUP_FORMAT,
    createSchemaFlowBackup,
    parseSchemaFlowBackup,
    restoreDiagramFromBackup,
} from '@/storage/backup';
import packageJson from '../../package.json';

export const runningIdGenerator = (): (() => string) => {
    let id = 0;
    return () => (id++).toString();
};

export const cloneDiagramWithRunningIds = (
    diagram: Diagram
): { diagram: Diagram; idsMap: Map<string, string> } => {
    const { diagram: clonedDiagram, idsMap } = cloneDiagram(diagram, {
        generateId: runningIdGenerator(),
    });

    return { diagram: clonedDiagram, idsMap };
};

const cloneDiagramWithIds = (diagram: Diagram): Diagram => ({
    ...cloneDiagram(diagram).diagram,
    id: generateDiagramId(),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const migrateDiagramJsonInput = (
    loadedDiagram: unknown
): Record<string, unknown> => {
    if (!isRecord(loadedDiagram)) {
        throw new Error('Invalid diagram JSON');
    }

    const detectedVersion = loadedDiagram.version ?? 0;

    if (typeof detectedVersion !== 'number') {
        throw new Error(
            `Invalid diagram version: detected ${String(
                detectedVersion
            )}, expected ${CURRENT_DIAGRAM_VERSION}`
        );
    }

    if (detectedVersion > CURRENT_DIAGRAM_VERSION) {
        throw new Error(
            `Unsupported diagram version: detected ${detectedVersion}, expected ${CURRENT_DIAGRAM_VERSION}`
        );
    }

    return {
        ...loadedDiagram,
        version: CURRENT_DIAGRAM_VERSION,
    };
};

export const diagramToJSONOutput = (diagram: Diagram): string => {
    return JSON.stringify(
        createSchemaFlowBackup({
            diagrams: [diagram],
            appVersion: packageJson.version,
        }),
        null,
        2
    );
};

export const diagramFromJSONInput = (json: string): Diagram => {
    const loadedDiagram = JSON.parse(json);

    if (
        typeof loadedDiagram === 'object' &&
        loadedDiagram !== null &&
        'format' in loadedDiagram &&
        loadedDiagram.format === SCHEMAFLOW_BACKUP_FORMAT
    ) {
        return restoreDiagramFromBackup({
            backup: parseSchemaFlowBackup(json),
        });
    }

    const diagram = diagramSchema.parse({
        ...migrateDiagramJsonInput(loadedDiagram),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return cloneDiagramWithIds(diagram);
};
