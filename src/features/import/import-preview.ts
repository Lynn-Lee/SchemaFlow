import {
    buildImportPreview,
    parseImportPreviewOnMainThread,
    type ImportPreviewRequest,
} from './import-preview-core';
import { parseImportPreviewInWorker } from '@/workers/import-worker/import-preview-client';

export type {
    ImportPreviewRequest,
    ImportPreviewSummary,
    ImportPreviewWarning,
    ParsedImportPreview,
} from './import-preview-core';

export { buildImportPreview };

export async function parseImportPreview(request: ImportPreviewRequest) {
    return parseImportPreviewInWorker({
        request,
        fallback: () => parseImportPreviewOnMainThread(request),
    });
}
