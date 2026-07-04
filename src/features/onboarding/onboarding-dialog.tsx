import React, { useCallback, useMemo, useState } from 'react';
import {
    Database,
    FileInput,
    LayoutTemplate,
    Plus,
    Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/button/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogInternalContent,
    DialogTitle,
} from '@/components/dialog/dialog';
import { useConfig } from '@/hooks/use-config';
import { useDialog } from '@/hooks/use-dialog';
import { useStorage } from '@/hooks/use-storage';
import {
    databaseSecondaryLogoMap,
    databaseTypeToLabelMap,
} from '@/lib/databases';
import { CreateDiagramDialogStep } from '@/dialogs/create-diagram-dialog/create-diagram-dialog-step';
import { DatabaseType } from '@/lib/domain/database-type';
import { CURRENT_DIAGRAM_VERSION, type Diagram } from '@/lib/domain/diagram';
import { cn, generateDiagramId } from '@/lib/utils';

type StartOption = 'import' | 'blank' | 'template';

interface OnboardingDialogProps {
    open: boolean;
    onClose: () => void;
}

const DATABASE_OPTIONS = [
    DatabaseType.POSTGRESQL,
    DatabaseType.MYSQL,
    DatabaseType.SQLITE,
    DatabaseType.SQL_SERVER,
    DatabaseType.MARIADB,
];

const START_OPTIONS: Array<{
    id: StartOption;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}> = [
    {
        id: 'import',
        title: 'Import existing database',
        description:
            'Start from SQL, DBML, or metadata and review it before saving.',
        icon: Upload,
    },
    {
        id: 'blank',
        title: 'New blank diagram',
        description: 'Create an empty local diagram for manual modeling.',
        icon: Plus,
    },
    {
        id: 'template',
        title: 'Browse templates',
        description:
            'Open a realistic example and clone it into your workspace.',
        icon: LayoutTemplate,
    },
];

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
    open,
    onClose,
}) => {
    const [databaseType, setDatabaseType] = useState<DatabaseType>();
    const [startOption, setStartOption] = useState<StartOption>();
    const [message, setMessage] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { addDiagram, deleteDiagram } = useStorage();
    const { updateConfig } = useConfig();
    const { openCreateDiagramDialog, openImportDiagramDialog } = useDialog();
    const navigate = useNavigate();

    const selectedDatabaseLabel = useMemo(
        () =>
            databaseType
                ? databaseTypeToLabelMap[databaseType]
                : 'No database selected',
        [databaseType]
    );

    const createBlankDiagram = useCallback(async () => {
        if (!databaseType) {
            setMessage(
                'Choose a database before creating or importing a diagram.'
            );
            return;
        }

        const diagram: Diagram = {
            id: generateDiagramId(),
            version: CURRENT_DIAGRAM_VERSION,
            name: 'Diagram 1',
            databaseType,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            setIsCreating(true);
            await addDiagram({ diagram });
            await updateConfig({ config: { defaultDiagramId: diagram.id } });
            onClose();
            navigate(`/diagrams/${diagram.id}`);
        } catch {
            await deleteDiagram(diagram.id);
            setMessage(
                'ChartDB could not create the diagram. Nothing was saved; try again.'
            );
        } finally {
            setIsCreating(false);
        }
    }, [
        addDiagram,
        databaseType,
        deleteDiagram,
        navigate,
        onClose,
        updateConfig,
    ]);

    const continueOnboarding = useCallback(async () => {
        if (!startOption) {
            setMessage('Choose how you want to start.');
            return;
        }

        if (startOption === 'template') {
            onClose();
            navigate('/templates/featured');
            return;
        }

        if (!databaseType) {
            setMessage(
                'Choose a database before creating or importing a diagram.'
            );
            return;
        }

        if (startOption === 'blank') {
            await createBlankDiagram();
            return;
        }

        onClose();
        openCreateDiagramDialog({
            initialDatabaseType: databaseType,
            initialStep: CreateDiagramDialogStep.IMPORT_DATABASE,
        });
    }, [
        createBlankDiagram,
        databaseType,
        navigate,
        onClose,
        openCreateDiagramDialog,
        startOption,
    ]);

    return (
        <Dialog open={open}>
            <DialogContent
                className="flex max-h-dvh w-[calc(100vw-1rem)] max-w-4xl flex-col gap-3 p-4 sm:p-6"
                onInteractOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Start a ChartDB diagram</DialogTitle>
                    <DialogDescription>
                        Pick the database first, then choose whether to import,
                        start blank, or explore templates.
                    </DialogDescription>
                </DialogHeader>
                <DialogInternalContent className="max-h-[calc(100dvh-11rem)] pr-1">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                        <section aria-labelledby="onboarding-database-title">
                            <div className="mb-2 flex items-center gap-2">
                                <Database className="size-4 text-sky-600" />
                                <h2
                                    id="onboarding-database-title"
                                    className="text-sm font-semibold"
                                >
                                    Database
                                </h2>
                            </div>
                            <div
                                role="radiogroup"
                                aria-label="Database type"
                                className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2"
                            >
                                {DATABASE_OPTIONS.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        role="radio"
                                        aria-checked={databaseType === type}
                                        onClick={() => {
                                            setDatabaseType(type);
                                            setMessage('');
                                        }}
                                        className={cn(
                                            'flex min-h-16 items-center gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm transition hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500',
                                            databaseType === type &&
                                                'border-sky-600 bg-sky-50 text-sky-950 dark:bg-sky-950/30 dark:text-sky-50'
                                        )}
                                    >
                                        <img
                                            src={databaseSecondaryLogoMap[type]}
                                            alt=""
                                            className="size-6 shrink-0"
                                        />
                                        <span className="min-w-0 break-words font-medium">
                                            {databaseTypeToLabelMap[type]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section aria-labelledby="onboarding-start-title">
                            <div className="mb-2 flex items-center gap-2">
                                <FileInput className="size-4 text-sky-600" />
                                <h2
                                    id="onboarding-start-title"
                                    className="text-sm font-semibold"
                                >
                                    Start option
                                </h2>
                            </div>
                            <div className="grid gap-2">
                                {START_OPTIONS.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => {
                                                setStartOption(option.id);
                                                setMessage('');
                                            }}
                                            className={cn(
                                                'flex min-h-20 items-start gap-3 rounded-md border bg-background p-3 text-left transition hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500',
                                                startOption === option.id &&
                                                    'border-sky-600 bg-sky-50 dark:bg-sky-950/30'
                                            )}
                                        >
                                            <Icon className="mt-0.5 size-5 shrink-0 text-sky-600" />
                                            <span className="min-w-0">
                                                <span className="block text-sm font-semibold">
                                                    {option.title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                    {option.description}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                    <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                        Selected: {selectedDatabaseLabel}
                    </div>
                    {message ? (
                        <div
                            role="status"
                            className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        >
                            {message}
                        </div>
                    ) : null}
                </DialogInternalContent>
                <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            onClose();
                            openImportDiagramDialog({});
                        }}
                    >
                        Import JSON backup
                    </Button>
                    <Button
                        type="button"
                        onClick={continueOnboarding}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
