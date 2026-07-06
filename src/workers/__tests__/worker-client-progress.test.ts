import { describe, expect, it, vi } from 'vitest';
import { runWorkerTask, WorkerTaskError } from '../worker-client';

describe('runWorkerTask progress and cancellation', () => {
    it('forwards progress events before resolving the worker result', async () => {
        const progress = vi.fn();

        class ProgressWorker extends EventTarget {
            postMessage(message: { id: string }) {
                this.dispatchEvent(
                    new MessageEvent('message', {
                        data: {
                            id: message.id,
                            ok: null,
                            progress: {
                                stage: 'parsing',
                                message: 'Parsing import input',
                            },
                        },
                    })
                );
                this.dispatchEvent(
                    new MessageEvent('message', {
                        data: {
                            id: message.id,
                            ok: true,
                            result: { mode: 'worker' },
                        },
                    })
                );
            }
            terminate() {}
        }

        await expect(
            runWorkerTask({
                type: 'import-preview',
                payload: { sql: 'create table users (id int);' },
                createWorker: () => new ProgressWorker() as unknown as Worker,
                fallback: async () => ({ mode: 'fallback' }),
                onProgress: progress,
            })
        ).resolves.toEqual({ mode: 'worker' });

        expect(progress).toHaveBeenCalledWith({
            stage: 'parsing',
            message: 'Parsing import input',
        });
    });

    it('terminates the worker and rejects when the abort signal is cancelled', async () => {
        const abortController = new AbortController();
        const terminate = vi.fn();

        class SlowWorker extends EventTarget {
            postMessage() {}
            terminate = terminate;
        }

        const promise = runWorkerTask({
            type: 'import-preview',
            payload: { sql: 'create table users (id int);' },
            createWorker: () => new SlowWorker() as unknown as Worker,
            fallback: async () => ({ mode: 'fallback' }),
            signal: abortController.signal,
        });

        abortController.abort();

        await expect(promise).rejects.toMatchObject(
            new WorkerTaskError({
                code: 'WORKER_TASK_CANCELLED',
                message: 'Worker task was cancelled.',
            })
        );
        expect(terminate).toHaveBeenCalledTimes(1);
    });

    it('terminates a stalled worker and uses the fallback after timeout', async () => {
        vi.useFakeTimers();
        const terminate = vi.fn();
        const fallback = vi.fn(async () => ({ mode: 'timeout-fallback' }));

        class StalledWorker extends EventTarget {
            postMessage() {}
            terminate = terminate;
        }

        const promise = runWorkerTask({
            type: 'import-preview',
            payload: { sql: 'create table users (id int);' },
            createWorker: () => new StalledWorker() as unknown as Worker,
            fallback,
            timeoutMs: 10,
        });

        await vi.advanceTimersByTimeAsync(10);

        await expect(promise).resolves.toEqual({ mode: 'timeout-fallback' });
        expect(fallback).toHaveBeenCalledTimes(1);
        expect(terminate).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });
});
