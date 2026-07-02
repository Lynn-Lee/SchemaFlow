import { cn } from '@/lib/utils';
import React, { lazy, Suspense, useCallback, useEffect } from 'react';
import type { EditorProps } from '@monaco-editor/react';
import { Spinner } from '../spinner/spinner';
import { useToast } from '@/components/toast/use-toast';
import { Button } from '../button/button';
import type { LucideIcon } from 'lucide-react';
import { Copy, CopyCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip';
import { useTranslation } from 'react-i18next';

export const Editor = lazy(() =>
    import('./code-editor').then((module) => ({
        default: module.Editor,
    }))
);

export const DiffEditor = lazy(() =>
    import('./code-editor').then((module) => ({
        default: module.DiffEditor,
    }))
);

const CodeSnippetEditor = lazy(() =>
    import('./code-snippet-editor').then((module) => ({
        default: module.CodeSnippetEditor,
    }))
);

export interface CodeSnippetAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    className?: string;
}

export interface CodeSnippetProps {
    className?: string;
    code: string;
    codeToCopy?: string;
    language?: 'sql' | 'shell' | 'dbml';
    loading?: boolean;
    autoScroll?: boolean;
    isComplete?: boolean;
    editorProps?: EditorProps;
    actions?: CodeSnippetAction[];
    actionsTooltipSide?: 'top' | 'right' | 'bottom' | 'left';
    allowCopy?: boolean;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = React.memo(
    ({
        className,
        code,
        codeToCopy,
        loading,
        language = 'sql',
        autoScroll = false,
        isComplete = true,
        editorProps,
        actions,
        actionsTooltipSide,
        allowCopy = true,
    }) => {
        const { t } = useTranslation();
        const { toast } = useToast();
        const [isCopied, setIsCopied] = React.useState(false);
        const [tooltipOpen, setTooltipOpen] = React.useState(false);
        const copyButtonLabel = t(isCopied ? 'copied' : 'copy_to_clipboard');

        useEffect(() => {
            if (!isCopied) return;
            setTimeout(() => {
                setIsCopied(false);
            }, 1500);
        }, [isCopied]);

        const copyToClipboard = useCallback(async () => {
            if (!navigator?.clipboard) {
                toast({
                    title: t('copy_to_clipboard_toast.unsupported.title'),
                    variant: 'destructive',
                    description: t(
                        'copy_to_clipboard_toast.unsupported.description'
                    ),
                });
                return;
            }

            try {
                await navigator.clipboard.writeText(codeToCopy ?? code);
                setIsCopied(true);
            } catch {
                setIsCopied(false);
                toast({
                    title: t('copy_to_clipboard_toast.failed.title'),
                    variant: 'destructive',
                    description: t(
                        'copy_to_clipboard_toast.failed.description'
                    ),
                });
            }
        }, [code, codeToCopy, t, toast]);

        return (
            <div
                className={cn(
                    'flex relative flex-1 justify-center border rounded-md overflow-hidden',
                    className
                )}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <Suspense fallback={<Spinner />}>
                        {isComplete ? (
                            <div className="absolute right-1 top-1 z-10 flex flex-col gap-1">
                                {allowCopy ? (
                                    <Tooltip
                                        onOpenChange={setTooltipOpen}
                                        open={isCopied || tooltipOpen}
                                    >
                                        <TooltipTrigger asChild>
                                            <span>
                                                <Button
                                                    className="h-fit p-1.5"
                                                    variant="outline"
                                                    onClick={copyToClipboard}
                                                    aria-label={copyButtonLabel}
                                                >
                                                    {isCopied ? (
                                                        <CopyCheck size={16} />
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side={actionsTooltipSide}
                                        >
                                            {t(
                                                isCopied
                                                    ? 'copied'
                                                    : 'copy_to_clipboard'
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : null}

                                {actions &&
                                    actions.length > 0 &&
                                    actions.map((action, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <span>
                                                    <Button
                                                        className={cn(
                                                            'h-fit p-1.5',
                                                            action.className
                                                        )}
                                                        variant="outline"
                                                        onClick={action.onClick}
                                                        aria-label={
                                                            action.label
                                                        }
                                                    >
                                                        <action.icon
                                                            size={16}
                                                        />
                                                    </Button>
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side={actionsTooltipSide}
                                            >
                                                {action.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                            </div>
                        ) : null}

                        <CodeSnippetEditor
                            code={code}
                            language={language}
                            autoScroll={autoScroll}
                            editorProps={editorProps}
                        />
                        {!isComplete ? (
                            <div className="absolute bottom-2 right-2 size-2 animate-blink rounded-full bg-pink-600" />
                        ) : null}
                    </Suspense>
                )}
            </div>
        );
    }
);

CodeSnippet.displayName = 'CodeSnippet';
