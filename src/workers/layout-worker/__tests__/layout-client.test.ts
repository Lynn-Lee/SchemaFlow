import { describe, expect, it } from 'vitest';
import { arrangeTablesForAreaInWorker } from '../layout-client';

describe('arrangeTablesForAreaInWorker', () => {
    it('falls back to the main-thread area layout when workers are unavailable', async () => {
        const result = await arrangeTablesForAreaInWorker({
            request: {
                tables: [
                    {
                        id: 'users',
                        name: 'users',
                        x: 0,
                        y: 0,
                        fields: [],
                        indexes: [],
                        color: '#fff',
                        isView: false,
                        createdAt: 1,
                    },
                ],
                relationships: [],
                areaRect: {
                    x: 100,
                    y: 200,
                    width: 500,
                    height: 400,
                },
            },
        });

        expect(result.positions).toEqual([
            {
                id: 'users',
                x: 130,
                y: 250,
            },
        ]);
        expect(result.requiredWidth).toBeGreaterThan(0);
        expect(result.requiredHeight).toBeGreaterThan(0);
    });
});
