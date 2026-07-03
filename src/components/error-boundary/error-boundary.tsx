import React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ChartDB render error', error, errorInfo);
    }

    private handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
                <section className="flex max-w-xl flex-col items-start gap-5">
                    <div className="space-y-2">
                        <p className="text-sm font-medium uppercase text-muted-foreground">
                            ChartDB recovery
                        </p>
                        <h1 className="text-3xl font-semibold">
                            Something went wrong
                        </h1>
                    </div>
                    <p className="text-base leading-7 text-muted-foreground">
                        ChartDB ran into an unexpected error while rendering the
                        app. Your local diagrams remain in browser storage, and
                        no error details or schema data were sent to a remote
                        service.
                    </p>
                    <button
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        type="button"
                        onClick={this.handleRefresh}
                    >
                        Refresh page
                    </button>
                </section>
            </main>
        );
    }
}
