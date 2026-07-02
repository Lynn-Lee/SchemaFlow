import type {
    ImportPreviewRequest,
    ParsedImportPreview,
} from '@/features/import/import-preview-core';
import { parseImportPreviewOnMainThread } from '@/features/import/import-preview-core';
import type {
    WorkerTaskEnvelope,
    WorkerTaskResponse,
} from '@/workers/worker-client';

async function handleImportPreview(
    request: ImportPreviewRequest
): Promise<ParsedImportPreview> {
    return parseImportPreviewOnMainThread(request);
}

self.addEventListener(
    'message',
    async (event: MessageEvent<WorkerTaskEnvelope<ImportPreviewRequest>>) => {
        const { id, type, payload } = event.data;
        if (type !== 'import-preview') {
            return;
        }

        try {
            const result = await handleImportPreview(payload);
            self.postMessage({
                id,
                ok: true,
                result,
            } satisfies WorkerTaskResponse<ParsedImportPreview>);
        } catch (error) {
            self.postMessage({
                id,
                ok: false,
                error: {
                    code: 'IMPORT_PREVIEW_PARSE_FAILED',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unable to parse the import input.',
                },
            } satisfies WorkerTaskResponse<ParsedImportPreview>);
        }
    }
);
