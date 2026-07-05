import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import {
    createMemoryRouter,
    RouterProvider,
    type RouteObject,
} from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from '@/router';
import { RouteErrorBoundary } from '../route-error-boundary';

const flattenRoutes = (routeObjects: RouteObject[]): RouteObject[] =>
    routeObjects.flatMap((route) => [
        route,
        ...(route.children ? flattenRoutes(route.children) : []),
    ]);

describe('RouteErrorBoundary', () => {
    it('is configured on every application route', () => {
        const routesWithoutErrorElement = flattenRoutes(routes).filter(
            (route) => !route.errorElement
        );

        expect(routesWithoutErrorElement).toEqual([]);
    });

    it('renders a branded recovery screen when a loader throws', async () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/',
                    element: <div>Home</div>,
                },
                {
                    path: '/broken',
                    element: <div>Broken</div>,
                    errorElement: <RouteErrorBoundary />,
                    loader: async () => {
                        throw new Error('template chunk failed');
                    },
                },
            ],
            { initialEntries: ['/'] }
        );

        render(<RouterProvider router={router} />);
        await act(async () => {
            await router.navigate('/broken');
        });

        expect(
            await screen.findByRole('heading', {
                name: /schemaflow could not open this page/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /返回首页/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /重试/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/unexpected application error/i)
        ).not.toBeInTheDocument();
    });
});
