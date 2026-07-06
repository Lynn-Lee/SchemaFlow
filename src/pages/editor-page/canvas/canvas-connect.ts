import type { DBField } from '@/lib/domain/db-field';
import type { DatabaseType } from '@/lib/domain/database-type';
import { areFieldTypesCompatible } from '@/lib/data/data-types/data-types';
import {
    BOTTOM_SOURCE_HANDLE_ID_PREFIX,
    TOP_SOURCE_HANDLE_ID_PREFIX,
} from './table-node/table-node-dependency-indicator';

export type CanvasConnectAction =
    | {
          type: 'create-dependency';
          tableId: string;
          dependentTableId: string;
      }
    | {
          type: 'create-relationship';
          sourceTableId: string;
          targetTableId: string;
          sourceFieldId: string;
          targetFieldId: string;
      }
    | { type: 'incompatible-fields' }
    | { type: 'none' };

export type CanvasConnectParams = {
    source?: string | null;
    target?: string | null;
    sourceHandle?: string | null;
    targetHandle?: string | null;
};

export const buildCanvasConnectAction = ({
    params,
    databaseType,
    getField,
}: {
    params: CanvasConnectParams;
    databaseType: DatabaseType;
    getField: (tableId: string, fieldId: string) => DBField | null | undefined;
}): CanvasConnectAction => {
    if (!params.source || !params.target) {
        return { type: 'none' };
    }

    if (
        params.sourceHandle?.startsWith?.(TOP_SOURCE_HANDLE_ID_PREFIX) ||
        params.sourceHandle?.startsWith?.(BOTTOM_SOURCE_HANDLE_ID_PREFIX)
    ) {
        return {
            type: 'create-dependency',
            tableId: params.target,
            dependentTableId: params.source,
        };
    }

    const sourceFieldId = params.sourceHandle?.split('_')?.pop() ?? '';
    const targetFieldId = params.targetHandle?.split('_')?.pop() ?? '';
    const sourceField = getField(params.source, sourceFieldId);
    const targetField = getField(params.target, targetFieldId);

    if (!sourceField || !targetField) {
        return { type: 'none' };
    }

    if (
        !areFieldTypesCompatible(
            sourceField.type,
            targetField.type,
            databaseType
        )
    ) {
        return { type: 'incompatible-fields' };
    }

    return {
        type: 'create-relationship',
        sourceTableId: params.source,
        targetTableId: params.target,
        sourceFieldId,
        targetFieldId,
    };
};
