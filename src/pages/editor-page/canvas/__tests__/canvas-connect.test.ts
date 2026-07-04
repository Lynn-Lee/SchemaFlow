import { describe, expect, it } from 'vitest';
import type { Connection } from '@xyflow/react';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBField } from '@/lib/domain/db-field';
import {
    BOTTOM_SOURCE_HANDLE_ID_PREFIX,
    TOP_SOURCE_HANDLE_ID_PREFIX,
} from '../table-node/table-node-dependency-indicator';
import { buildCanvasConnectAction } from '../canvas-connect';

const field = (id: string, typeId: string): DBField =>
    ({
        id,
        name: id,
        type: { id: typeId, name: typeId },
        primaryKey: false,
        unique: false,
        nullable: true,
        createdAt: 1,
    }) as DBField;

describe('canvas connect action', () => {
    it('creates a dependency from top or bottom table handles', () => {
        expect(
            buildCanvasConnectAction({
                params: {
                    source: 'orders',
                    target: 'users',
                    sourceHandle: `${TOP_SOURCE_HANDLE_ID_PREFIX}orders`,
                } as Connection,
                databaseType: DatabaseType.POSTGRESQL,
                getField: () => undefined,
            })
        ).toEqual({
            type: 'create-dependency',
            tableId: 'users',
            dependentTableId: 'orders',
        });

        expect(
            buildCanvasConnectAction({
                params: {
                    source: 'payments',
                    target: 'orders',
                    sourceHandle: `${BOTTOM_SOURCE_HANDLE_ID_PREFIX}payments`,
                } as Connection,
                databaseType: DatabaseType.POSTGRESQL,
                getField: () => undefined,
            })
        ).toEqual({
            type: 'create-dependency',
            tableId: 'orders',
            dependentTableId: 'payments',
        });
    });

    it('ignores relationship connections when either field is missing', () => {
        expect(
            buildCanvasConnectAction({
                params: {
                    source: 'orders',
                    target: 'users',
                    sourceHandle: 'source_order_id',
                    targetHandle: 'target_id',
                } as Connection,
                databaseType: DatabaseType.POSTGRESQL,
                getField: (tableId, fieldId) =>
                    tableId === 'orders' && fieldId === 'id'
                        ? field('id', 'integer')
                        : undefined,
            })
        ).toEqual({ type: 'none' });
    });

    it('reports incompatible field types before creating a relationship', () => {
        expect(
            buildCanvasConnectAction({
                params: {
                    source: 'orders',
                    target: 'users',
                    sourceHandle: 'source_order_uuid',
                    targetHandle: 'target_id',
                } as Connection,
                databaseType: DatabaseType.POSTGRESQL,
                getField: (_tableId, fieldId) =>
                    fieldId === 'id'
                        ? field('id', 'uuid')
                        : field('order_uuid', 'integer'),
            })
        ).toEqual({ type: 'incompatible-fields' });
    });

    it('creates a relationship for compatible field types', () => {
        expect(
            buildCanvasConnectAction({
                params: {
                    source: 'orders',
                    target: 'users',
                    sourceHandle: 'source_user_id',
                    targetHandle: 'target_id',
                } as Connection,
                databaseType: DatabaseType.POSTGRESQL,
                getField: (_tableId, fieldId) => field(fieldId, 'integer'),
            })
        ).toEqual({
            type: 'create-relationship',
            sourceTableId: 'orders',
            targetTableId: 'users',
            sourceFieldId: 'id',
            targetFieldId: 'id',
        });
    });
});
