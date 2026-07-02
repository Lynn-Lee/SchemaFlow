import { describe, expect, it, vi } from 'vitest';
import { runWorkerTask, WorkerTaskError } from '../worker-client';

describe('runWorkerTask', () => {
    it('uses the main-thread fallback when Worker is unavailable', async () => {
        const fallback = vi.fn(async () => ({ mode: 'fallback' }));

        await expect(
            runWorkerTask({
                type: 'import-preview',
                payload: { sql: 'select 1' },
                fallback,
            })
        ).resolves.toEqual({ mode: 'fallback' });

        expect(fallback).toHaveBeenCalledTimes(1);
    });

    it('rejects with a structured worker error', async () => {
        const originalWorker = globalThis.Worker;
        class ErrorWorker extends EventTarget {
            postMessage(message: { id: string }) {
                this.dispatchEvent(
                    new MessageEvent('message', {
                        data: {
                            id: message.id,
                            ok: false,
                            error: {
                                code: 'IMPORT_PREVIEW_PARSE_FAILED',
                                message: 'bad ddl',
                            },
                        },
                    })
                );
            }
            terminate() {}
        }

        vi.stubGlobal('Worker', ErrorWorker);

        await expect(
            runWorkerTask({
                type: 'import-preview',
                payload: { sql: 'bad' },
                createWorker: () => new ErrorWorker() as unknown as Worker,
                fallback: async () => ({ mode: 'fallback' }),
            })
        ).rejects.toMatchObject(
            new WorkerTaskError({
                code: 'IMPORT_PREVIEW_PARSE_FAILED',
                message: 'bad ddl',
            })
        );

        vi.unstubAllGlobals();
        globalThis.Worker = originalWorker;
    });
});
