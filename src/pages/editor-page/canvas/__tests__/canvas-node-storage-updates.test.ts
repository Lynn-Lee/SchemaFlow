import type {
    NodeDimensionChange,
    NodePositionChange,
    NodeRemoveChange,
} from '@xyflow/react';
import { describe, expect, it } from 'vitest';
import type { DBTable } from '@/lib/domain/db-table';
import {
    buildAreaStorageChanges,
    buildNoteStorageChanges,
    buildTableStorageChanges,
} from '../canvas-node-storage-updates';

describe('canvas node storage updates', () => {
    it('applies direct table position, width, removal, and removed area cleanup', () => {
        const tables = [
            {
                id: 'table-1',
                x: 10,
                y: 20,
                width: 120,
                parentAreaId: 'area-1',
            },
            { id: 'table-2', x: 30, y: 40, width: 140 },
            { id: 'table-3', x: 50, y: 60, parentAreaId: 'area-removed' },
        ] as DBTable[];

        const result = buildTableStorageChanges({
            tables,
            positionChanges: [
                {
                    id: 'table-1',
                    type: 'position',
                    position: { x: 15, y: 25 },
                },
            ] as NodePositionChange[],
            sizeChanges: [
                {
                    id: 'table-1',
                    type: 'dimensions',
                    dimensions: { width: 240, height: 90 },
                },
            ] as NodeDimensionChange[],
            removeChanges: [
                { id: 'table-2', type: 'remove' },
            ] as NodeRemoveChange[],
            areaRemoveChanges: [
                { id: 'area-removed', type: 'remove' },
            ] as NodeRemoveChange[],
            childTableMovements: new Map(),
        });

        expect(result.updateHistory).toBe(true);
        expect(result.tables).toEqual([
            expect.objectContaining({
                id: 'table-1',
                x: 15,
                y: 25,
                width: 240,
                parentAreaId: 'area-1',
            }),
            expect.objectContaining({
                id: 'table-3',
                x: 50,
                y: 60,
                parentAreaId: null,
            }),
        ]);
    });

    it('moves child tables when an area drag is committed without adding history', () => {
        const tables = [
            { id: 'table-1', x: 10, y: 20 },
            { id: 'table-2', x: 30, y: 40 },
        ] as DBTable[];

        const result = buildTableStorageChanges({
            tables,
            positionChanges: [],
            sizeChanges: [],
            removeChanges: [],
            areaRemoveChanges: [],
            childTableMovements: new Map([
                ['table-1', { deltaX: 5, deltaY: -3 }],
            ]),
        });

        expect(result.updateHistory).toBe(false);
        expect(result.tables).toEqual([
            expect.objectContaining({ id: 'table-1', x: 15, y: 17 }),
            expect.objectContaining({ id: 'table-2', x: 30, y: 40 }),
        ]);
    });

    it('builds area updates and removals while dropping updates for removed areas', () => {
        const result = buildAreaStorageChanges({
            positionChanges: [
                {
                    id: 'area-1',
                    type: 'position',
                    position: { x: 15, y: 25 },
                },
                {
                    id: 'area-2',
                    type: 'position',
                    position: { x: 50, y: 60 },
                },
            ] as NodePositionChange[],
            sizeChanges: [
                {
                    id: 'area-1',
                    type: 'dimensions',
                    dimensions: { width: 400, height: 180 },
                },
            ] as NodeDimensionChange[],
            removeChanges: [
                { id: 'area-2', type: 'remove' },
            ] as NodeRemoveChange[],
        });

        expect(result.updates).toEqual([
            {
                id: 'area-1',
                updates: { x: 15, y: 25, width: 400, height: 180 },
            },
        ]);
        expect(result.removeIds).toEqual(['area-2']);
    });

    it('builds note updates and removals while dropping updates for removed notes', () => {
        const result = buildNoteStorageChanges({
            positionChanges: [
                {
                    id: 'note-1',
                    type: 'position',
                    position: { x: 15, y: 25 },
                },
                {
                    id: 'note-2',
                    type: 'position',
                    position: { x: 50, y: 60 },
                },
            ] as NodePositionChange[],
            sizeChanges: [
                {
                    id: 'note-1',
                    type: 'dimensions',
                    dimensions: { width: 260, height: 140 },
                },
            ] as NodeDimensionChange[],
            removeChanges: [
                { id: 'note-2', type: 'remove' },
            ] as NodeRemoveChange[],
        });

        expect(result.updates).toEqual([
            {
                id: 'note-1',
                updates: { x: 15, y: 25, width: 260, height: 140 },
            },
        ]);
        expect(result.removeIds).toEqual(['note-2']);
    });
});
