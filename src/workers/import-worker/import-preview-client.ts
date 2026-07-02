import type {
    ImportPreviewRequest,
    ParsedImportPreview,
} from '@/features/import/import-preview-core';
import {
    createModuleWorkerFactory,
    runWorkerTask,
    type WorkerFactory,
} from '@/workers/worker-client';

export async function parseImportPreviewInWorker({
    request,
    fallback,
    createWorker = createModuleWorkerFactory(
        new URL('./import-worker.ts', import.meta.url)
    ),
}: {
    request: ImportPreviewRequest;
    fallback: () => Promise<ParsedImportPreview>;
    createWorker?: WorkerFactory;
}): Promise<ParsedImportPreview> {
    return runWorkerTask<ImportPreviewRequest, ParsedImportPreview>({
        type: 'import-preview',
        payload: request,
        createWorker,
        fallback,
    });
}
