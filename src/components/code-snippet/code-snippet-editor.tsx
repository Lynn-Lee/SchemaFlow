import React, { lazy, useEffect, useState } from 'react';
import type { EditorProps } from '@monaco-editor/react';
import { useMonaco } from '@monaco-editor/react';
import { useTheme } from '@/hooks/use-theme';
import { Spinner } from '../spinner/spinner';
import { DarkTheme } from './themes/dark';
import { LightTheme } from './themes/light';
import { ensureMonaco } from './config';

const MonacoEditor = lazy(() =>
    import('./code-editor').then((module) => ({
        default: module.Editor,
    }))
);

export interface CodeSnippetEditorProps {
    autoScroll?: boolean;
    code: string;
    editorProps?: EditorProps;
    language: 'sql' | 'shell' | 'dbml';
}

const editorAriaLabelByLanguage: Record<
    CodeSnippetEditorProps['language'],
    string
> = {
    sql: 'SQL query editor',
    shell: 'Shell command editor',
    dbml: 'DBML editor',
};

export const CodeSnippetEditor: React.FC<CodeSnippetEditorProps> = ({
    autoScroll = false,
    code,
    editorProps,
    language,
}) => {
    const monaco = useMonaco();
    const { effectiveTheme } = useTheme();
    const [isMonacoReady, setIsMonacoReady] = useState(false);
    const editorAriaLabel =
        editorProps?.options?.ariaLabel ?? editorAriaLabelByLanguage[language];

    useEffect(() => {
        let isMounted = true;

        ensureMonaco().then(() => {
            if (isMounted) {
                setIsMonacoReady(true);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        monaco?.editor?.defineTheme?.(
            effectiveTheme,
            effectiveTheme === 'dark' ? DarkTheme : LightTheme
        );
        monaco?.editor?.setTheme?.(effectiveTheme);
    }, [monaco, effectiveTheme]);

    useEffect(() => {
        if (!monaco || !autoScroll) return;

        const editor = monaco.editor.getModels()[0];
        if (!editor) return;

        const lineCount = editor.getLineCount();
        monaco.editor.getEditors()[0]?.revealLine(lineCount);
    }, [code, monaco, autoScroll]);

    if (!isMonacoReady) {
        return <Spinner />;
    }

    return (
        <MonacoEditor
            value={code}
            language={language}
            loading={<Spinner />}
            theme={effectiveTheme}
            {...editorProps}
            options={{
                editContext: false,
                readOnly: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderValidationDecorations: 'off',
                lineDecorationsWidth: 0,
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                contextmenu: false,
                ...editorProps?.options,
                ariaLabel: editorAriaLabel,
                guides: {
                    indentation: false,
                    ...editorProps?.options?.guides,
                },
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                    alwaysConsumeMouseWheel: false,
                    ...editorProps?.options?.scrollbar,
                },
                minimap: {
                    enabled: false,
                    ...editorProps?.options?.minimap,
                },
            }}
        />
    );
};
