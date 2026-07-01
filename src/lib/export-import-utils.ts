import { cloneDiagram } from './clone';
import { diagramSchema, type Diagram } from './domain/diagram';
import { generateDiagramId } from './utils';
import {
    CHARTDB_BACKUP_FORMAT,
    createChartDBBackup,
    parseChartDBBackup,
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

export const diagramToJSONOutput = (diagram: Diagram): string => {
    return JSON.stringify(
        createChartDBBackup({
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
        loadedDiagram.format === CHARTDB_BACKUP_FORMAT
    ) {
        return restoreDiagramFromBackup({
            backup: parseChartDBBackup(json),
        });
    }

    const diagram = diagramSchema.parse({
        ...loadedDiagram,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return cloneDiagramWithIds(diagram);
};
