import { describe, expect, it, vi } from 'vitest';
import { addEdge, createGraph } from '@/lib/graph';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBTable } from '@/lib/domain/db-table';
import {
    buildCanvasVisibilityState,
    pulseOverlappingTablesHighlight,
} from '../canvas-visibility-state';

const table = (overrides: Partial<DBTable>): DBTable =>
    ({
        id: 'table-1',
        name: 'table_1',
        schema: 'public',
        x: 0,
        y: 0,
        width: 100,
        fields: [],
        indexes: [],
        color: '',
        isView: false,
        ...overrides,
    }) as DBTable;

describe('canvas visibility state', () => {
    it('detects overlaps and all-tables-hidden filter state', () => {
        const overlapGraph = addEdge(
            createGraph<string>(),
            'table-1',
            'table-2'
        );

        const result = buildCanvasVisibilityState({
            overlapGraph,
            hasActiveFilter: true,
            tables: [
                table({ id: 'table-1', schema: 'private' }),
                table({ id: 'table-2', schema: 'audit' }),
            ],
            filter: { schemaIds: ['public'] },
            databaseType: DatabaseType.POSTGRESQL,
            filterLoading: false,
        });

        expect(result.hasOverlappingTables).toBe(true);
        expect(result.allTablesHiddenByFilter).toBe(true);
    });

    it('keeps all-tables-hidden false while filter is inactive, loading, or tableless', () => {
        const base = {
            overlapGraph: createGraph<string>(),
            tables: [table({ id: 'table-1', schema: 'private' })],
            filter: { schemaIds: ['public'] },
            databaseType: DatabaseType.POSTGRESQL,
        };

        expect(
            buildCanvasVisibilityState({
                ...base,
                hasActiveFilter: false,
                filterLoading: false,
            }).allTablesHiddenByFilter
        ).toBe(false);
        expect(
            buildCanvasVisibilityState({
                ...base,
                hasActiveFilter: true,
                filterLoading: true,
            }).allTablesHiddenByFilter
        ).toBe(false);
        expect(
            buildCanvasVisibilityState({
                ...base,
                hasActiveFilter: true,
                tables: [],
                filterLoading: false,
            }).allTablesHiddenByFilter
        ).toBe(false);
    });

    it('sets overlapping highlight and clears it after the pulse delay', () => {
        vi.useFakeTimers();
        const setHighlightOverlappingTables = vi.fn();

        pulseOverlappingTablesHighlight({
            setHighlightOverlappingTables,
            durationMs: 600,
        });

        expect(setHighlightOverlappingTables).toHaveBeenCalledWith(true);

        vi.advanceTimersByTime(600);

        expect(setHighlightOverlappingTables).toHaveBeenLastCalledWith(false);
        vi.useRealTimers();
    });
});
