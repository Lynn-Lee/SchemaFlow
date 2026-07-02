import type { Area } from '@/lib/domain/area';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import { arrangeTablesForArea } from '@/lib/utils/area-utils';
import {
    createModuleWorkerFactory,
    runWorkerTask,
    type WorkerFactory,
} from '@/workers/worker-client';

export interface AreaLayoutRequest {
    tables: DBTable[];
    relationships: DBRelationship[];
    areaRect: Pick<Area, 'x' | 'y' | 'width' | 'height'>;
}

export interface AreaLayoutResult {
    positions: { id: string; x: number; y: number }[];
    requiredWidth: number;
    requiredHeight: number;
}

export async function arrangeTablesForAreaInWorker({
    request,
    createWorker = createModuleWorkerFactory(
        new URL('./layout-worker.ts', import.meta.url)
    ),
}: {
    request: AreaLayoutRequest;
    createWorker?: WorkerFactory;
}): Promise<AreaLayoutResult> {
    return runWorkerTask<AreaLayoutRequest, AreaLayoutResult>({
        type: 'area-layout',
        payload: request,
        createWorker,
        fallback: async () =>
            arrangeTablesForArea(
                request.tables,
                request.relationships,
                request.areaRect
            ),
    });
}
