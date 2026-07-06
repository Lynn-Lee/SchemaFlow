import { loader } from '@monaco-editor/react';

type MonacoWorker = new () => Worker;

let monacoSetupPromise: Promise<void> | undefined;

export const ensureMonaco = (): Promise<void> => {
    monacoSetupPromise ??= Promise.all([
        import('monaco-editor'),
        import('monaco-editor/esm/vs/editor/editor.worker?worker'),
        import('monaco-editor/esm/vs/language/json/json.worker?worker'),
        import('monaco-editor/esm/vs/language/css/css.worker?worker'),
        import('monaco-editor/esm/vs/language/html/html.worker?worker'),
        import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
    ]).then(
        ([
            monaco,
            { default: EditorWorker },
            { default: JsonWorker },
            { default: CssWorker },
            { default: HtmlWorker },
            { default: TsWorker },
        ]) => {
            const workerByLabel: Record<string, MonacoWorker> = {
                json: JsonWorker,
                css: CssWorker,
                scss: CssWorker,
                less: CssWorker,
                html: HtmlWorker,
                handlebars: HtmlWorker,
                razor: HtmlWorker,
                typescript: TsWorker,
                javascript: TsWorker,
            };

            globalThis.MonacoEnvironment = {
                getWorker(_, label) {
                    const WorkerConstructor =
                        workerByLabel[label] ?? EditorWorker;
                    return new WorkerConstructor();
                },
            };

            loader.config({ monaco });
        }
    );

    return monacoSetupPromise;
};
