import { arrangeTablesForArea } from '@/lib/utils/area-utils';
import type {
    WorkerTaskEnvelope,
    WorkerTaskResponse,
} from '@/workers/worker-client';
import type { AreaLayoutRequest, AreaLayoutResult } from './layout-client';

self.addEventListener(
    'message',
    (event: MessageEvent<WorkerTaskEnvelope<AreaLayoutRequest>>) => {
        const { id, type, payload } = event.data;
        if (type !== 'area-layout') {
            return;
        }

        try {
            const result = arrangeTablesForArea(
                payload.tables,
                payload.relationships,
                payload.areaRect
            );
            self.postMessage({
                id,
                ok: true,
                result,
            } satisfies WorkerTaskResponse<AreaLayoutResult>);
        } catch (error) {
            self.postMessage({
                id,
                ok: false,
                error: {
                    code: 'AREA_LAYOUT_FAILED',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unable to arrange tables.',
                },
            } satisfies WorkerTaskResponse<AreaLayoutResult>);
        }
    }
);
