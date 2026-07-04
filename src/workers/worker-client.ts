export interface WorkerTaskEnvelope<TPayload> {
    id: string;
    type: string;
    payload: TPayload;
}

export interface WorkerTaskProgress {
    stage: string;
    message: string;
}

export type WorkerTaskResponse<TResult> =
    | {
          id: string;
          ok: true;
          result: TResult;
      }
    | {
          id: string;
          ok: false;
          error: {
              code: string;
              message: string;
          };
      }
    | {
          id: string;
          ok: null;
          progress: WorkerTaskProgress;
      };

export class WorkerTaskError extends Error {
    readonly code: string;

    constructor({ code, message }: { code: string; message: string }) {
        super(message);
        this.name = 'WorkerTaskError';
        this.code = code;
    }
}

export type WorkerFactory = () => Worker;

export type WorkerTaskFallbackReason =
    | 'worker-unavailable'
    | 'worker-error'
    | 'worker-timeout';

export interface WorkerTaskFallbackContext {
    reason: WorkerTaskFallbackReason;
}

const DEFAULT_WORKER_TASK_TIMEOUT_MS = 15_000;

export function createModuleWorkerFactory(workerUrl: URL): WorkerFactory {
    return () => new Worker(workerUrl, { type: 'module' });
}

export function createWorkerTaskId(prefix: string): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}:${crypto.randomUUID()}`;
    }

    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

export async function runWorkerTask<TPayload, TResult>({
    type,
    payload,
    createWorker,
    fallback,
    onProgress,
    signal,
    timeoutMs = DEFAULT_WORKER_TASK_TIMEOUT_MS,
}: {
    type: string;
    payload: TPayload;
    createWorker?: WorkerFactory;
    fallback: (context?: WorkerTaskFallbackContext) => Promise<TResult>;
    onProgress?: (progress: WorkerTaskProgress) => void;
    signal?: AbortSignal;
    timeoutMs?: number;
}): Promise<TResult> {
    if (signal?.aborted) {
        throw new WorkerTaskError({
            code: 'WORKER_TASK_CANCELLED',
            message: 'Worker task was cancelled.',
        });
    }

    if (!createWorker) {
        return fallback({ reason: 'worker-unavailable' });
    }

    const id = createWorkerTaskId(type);
    let worker: Worker;

    try {
        worker = createWorker();
    } catch {
        return fallback({ reason: 'worker-unavailable' });
    }

    return new Promise<TResult>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
            cleanup();
            fallback({ reason: 'worker-timeout' }).then(resolve, reject);
        }, timeoutMs);

        const cleanup = () => {
            window.clearTimeout(timeoutId);
            worker.removeEventListener('message', handleMessage);
            worker.removeEventListener('error', handleError);
            signal?.removeEventListener('abort', handleAbort);
            worker.terminate();
        };

        const handleError = () => {
            cleanup();
            if (signal?.aborted) {
                reject(
                    new WorkerTaskError({
                        code: 'WORKER_TASK_CANCELLED',
                        message: 'Worker task was cancelled.',
                    })
                );
                return;
            }

            fallback({ reason: 'worker-error' }).then(resolve, reject);
        };

        const handleAbort = () => {
            cleanup();
            reject(
                new WorkerTaskError({
                    code: 'WORKER_TASK_CANCELLED',
                    message: 'Worker task was cancelled.',
                })
            );
        };

        const handleMessage = (
            event: MessageEvent<WorkerTaskResponse<TResult>>
        ) => {
            const response = event.data;
            if (!response || response.id !== id) {
                return;
            }

            if (response.ok === null) {
                onProgress?.(response.progress);
                return;
            }

            cleanup();
            if (response.ok) {
                resolve(response.result);
            } else {
                reject(new WorkerTaskError(response.error));
            }
        };

        worker.addEventListener('message', handleMessage);
        worker.addEventListener('error', handleError);
        signal?.addEventListener('abort', handleAbort, { once: true });
        worker.postMessage({
            id,
            type,
            payload,
        } satisfies WorkerTaskEnvelope<TPayload>);
    });
}
