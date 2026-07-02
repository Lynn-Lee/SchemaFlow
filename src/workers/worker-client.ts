export interface WorkerTaskEnvelope<TPayload> {
    id: string;
    type: string;
    payload: TPayload;
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
}: {
    type: string;
    payload: TPayload;
    createWorker?: WorkerFactory;
    fallback: () => Promise<TResult>;
}): Promise<TResult> {
    if (typeof Worker === 'undefined' || !createWorker) {
        return fallback();
    }

    const id = createWorkerTaskId(type);
    let worker: Worker;

    try {
        worker = createWorker();
    } catch {
        return fallback();
    }

    return new Promise<TResult>((resolve, reject) => {
        const cleanup = () => {
            worker.removeEventListener('message', handleMessage);
            worker.removeEventListener('error', handleError);
            worker.terminate();
        };

        const handleError = () => {
            cleanup();
            fallback().then(resolve, reject);
        };

        const handleMessage = (
            event: MessageEvent<WorkerTaskResponse<TResult>>
        ) => {
            const response = event.data;
            if (!response || response.id !== id) {
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
        worker.postMessage({
            id,
            type,
            payload,
        } satisfies WorkerTaskEnvelope<TPayload>);
    });
}
