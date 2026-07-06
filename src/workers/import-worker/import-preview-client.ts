import type {
    ImportPreviewRequest,
    ParsedImportPreview,
} from '@/features/import/import-preview-core';
import {
    createModuleWorkerFactory,
    runWorkerTask,
    type WorkerTaskProgress,
    type WorkerFactory,
} from '@/workers/worker-client';

export async function parseImportPreviewInWorker({
    request,
    fallback,
    createWorker = createModuleWorkerFactory(
        new URL('./import-worker.ts', import.meta.url)
    ),
    onProgress,
    signal,
}: {
    request: ImportPreviewRequest;
    fallback: () => Promise<ParsedImportPreview>;
    createWorker?: WorkerFactory;
    onProgress?: (progress: WorkerTaskProgress) => void;
    signal?: AbortSignal;
}): Promise<ParsedImportPreview> {
    return runWorkerTask<ImportPreviewRequest, ParsedImportPreview>({
        type: 'import-preview',
        payload: request,
        createWorker,
        fallback,
        onProgress,
        signal,
    });
}
