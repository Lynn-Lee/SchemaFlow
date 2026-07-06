import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { TooltipProvider } from './components/tooltip/tooltip';
import { HelmetData } from './helmet/helmet-data';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/error-boundary/error-boundary';

export const App = () => {
    return (
        <HelmetProvider>
            <HelmetData />
            <ErrorBoundary>
                <TooltipProvider>
                    <RouterProvider router={router} />
                </TooltipProvider>
            </ErrorBoundary>
        </HelmetProvider>
    );
};
