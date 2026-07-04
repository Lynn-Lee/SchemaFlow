import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/button/button';

const getRouteErrorMessage = (error: unknown) => {
    if (isRouteErrorResponse(error)) {
        return `${error.status} ${error.statusText}`;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Unknown route error';
};

export const RouteErrorBoundary = () => {
    const error = useRouteError();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
            <section className="flex w-full max-w-xl flex-col items-start gap-6 rounded-md border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                        <AlertTriangle aria-hidden="true" className="size-5" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium uppercase text-muted-foreground">
                            ChartDB route recovery
                        </p>
                        <h1 className="text-2xl font-semibold">
                            ChartDB could not open this page
                        </h1>
                    </div>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                    The page loader or route chunk failed before ChartDB could
                    render the requested view. Your local diagrams remain in
                    browser storage.
                </p>

                <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {getRouteErrorMessage(error)}
                </p>

                <div className="flex flex-wrap gap-3">
                    <Button asChild>
                        <a href="/">返回首页</a>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRetry}
                    >
                        重试
                    </Button>
                </div>
            </section>
        </main>
    );
};
