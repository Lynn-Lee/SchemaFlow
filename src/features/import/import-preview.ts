import {
    buildImportPreview,
    parseImportPreviewOnMainThread,
    type ImportPreviewRequest,
} from './import-preview-core';
import { parseImportPreviewInWorker } from '@/workers/import-worker/import-preview-client';
import type { WorkerTaskProgress } from '@/workers/worker-client';

export type {
    ImportPreviewRequest,
    ImportPreviewSummary,
    ImportPreviewWarning,
    ParsedImportPreview,
} from './import-preview-core';

export type ImportPreviewProgress = WorkerTaskProgress;

export { buildImportPreview };

export async function parseImportPreview(
    request: ImportPreviewRequest,
    options: {
        signal?: AbortSignal;
        onProgress?: (progress: ImportPreviewProgress) => void;
    } = {}
) {
    return parseImportPreviewInWorker({
        request,
        fallback: async () => {
            options.onProgress?.({
                stage: 'parsing',
                message: 'Parsing import input',
            });
            if (options.signal?.aborted) {
                throw new Error('Import preview was cancelled.');
            }
            const result = await parseImportPreviewOnMainThread(request);
            if (options.signal?.aborted) {
                throw new Error('Import preview was cancelled.');
            }
            return result;
        },
        onProgress: options.onProgress,
        signal: options.signal,
    });
}
