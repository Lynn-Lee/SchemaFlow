import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SchemaFlowContext } from './schemaflow-context';
import type { StorageContext } from '../storage-context/storage-context';
import type { RedoUndoStackContext } from '../history-context/redo-undo-stack-context';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DBIndex } from '@/lib/domain/db-index';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import { generateId } from '@/lib/utils';
import {
    applyIndexCommand,
    createAddIndexCommand,
    createCommandHistoryBatch,
    createCommandHistoryEntry,
    createDeleteIndexCommand,
    createUpdateIndexCommand,
    type CommandContext,
    type CommandHistoryBatch,
    type CommandResult,
    type DiagramCommand,
    type DiagramFieldIndexRelationshipCommandState,
} from '@/schema-core/commands';

export interface UseIndexOperationsParams {
    addUndoAction: RedoUndoStackContext['addUndoAction'];
    commandContext: CommandContext;
    databaseType: DatabaseType;
    db: StorageContext;
    diagramId: string;
    getTable: (id: string) => DBTable | null;
    relationships: DBRelationship[];
    resetRedoStack: RedoUndoStackContext['resetRedoStack'];
    setDiagramUpdatedAt: Dispatch<SetStateAction<Date>>;
    setTables: Dispatch<SetStateAction<DBTable[]>>;
    tables: DBTable[];
}

export function useIndexOperations({
    addUndoAction,
    commandContext,
    databaseType,
    db,
    diagramId,
    getTable,
    relationships,
    resetRedoStack,
    setDiagramUpdatedAt,
    setTables,
    tables,
}: UseIndexOperationsParams): Pick<
    SchemaFlowContext,
    'addIndex' | 'createIndex' | 'getIndex' | 'removeIndex' | 'updateIndex'
> {
    const getIndex: SchemaFlowContext['getIndex'] = useCallback(
        (tableId: string, indexId: string) => {
            const table = getTable(tableId);
            return table?.indexes.find((i) => i.id === indexId) ?? null;
        },
        [getTable]
    );

    const addIndex: SchemaFlowContext['addIndex'] = useCallback(
        async (
            tableId: string,
            index: DBIndex,
            options = { updateHistory: true }
        ) => {
            const command = createAddIndexCommand({
                context: commandContext,
                tableId,
                index,
            });
            const result = applyIndexCommand({
                context: commandContext,
                state: createCommandState({
                    databaseType,
                    tables,
                    relationships,
                }),
                command,
            });
            if (result.status !== 'success') {
                return;
            }

            setTables(result.state.tables);

            const dbTable = await db.getTable({ diagramId, id: tableId });
            if (!dbTable) {
                return;
            }
            const updatedTable = result.state.tables.find(
                (table) => table.id === tableId
            );
            if (!updatedTable) {
                return;
            }

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (options.updateHistory) {
                addUndoAction({
                    action: 'addIndex',
                    redoData: { tableId, index },
                    undoData: { tableId, indexId: index.id },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    const removeIndex: SchemaFlowContext['removeIndex'] = useCallback(
        async (
            tableId: string,
            indexId: string,
            options = { updateHistory: true }
        ) => {
            const prevIndex = getIndex(tableId, indexId);
            const command = createDeleteIndexCommand({
                context: commandContext,
                tableId,
                indexId,
            });
            const result = applyIndexCommand({
                context: commandContext,
                state: createCommandState({
                    databaseType,
                    tables,
                    relationships,
                }),
                command,
            });
            if (result.status !== 'success') {
                return;
            }

            setTables(result.state.tables);

            const dbTable = await db.getTable({
                diagramId,
                id: tableId,
            });

            if (!dbTable) {
                return;
            }
            const updatedTable = result.state.tables.find(
                (table) => table.id === tableId
            );
            if (!updatedTable) {
                return;
            }

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (!!prevIndex && options.updateHistory) {
                addUndoAction({
                    action: 'removeIndex',
                    redoData: { indexId, tableId },
                    undoData: { tableId, index: prevIndex },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            getIndex,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    const createIndex: SchemaFlowContext['createIndex'] = useCallback(
        async (tableId: string) => {
            const table = getTable(tableId);
            const index: DBIndex = {
                id: generateId(),
                name: `index_${(table?.indexes?.length ?? 0) + 1}`,
                fieldIds: [],
                unique: false,
                createdAt: Date.now(),
            };

            await addIndex(tableId, index);

            return index;
        },
        [addIndex, getTable]
    );

    const updateIndex: SchemaFlowContext['updateIndex'] = useCallback(
        async (
            tableId: string,
            indexId: string,
            index: Partial<DBIndex>,
            options = { updateHistory: true }
        ) => {
            const prevIndex = getIndex(tableId, indexId);
            const command = createUpdateIndexCommand({
                context: commandContext,
                tableId,
                indexId,
                index,
            });
            const result = applyIndexCommand({
                context: commandContext,
                state: createCommandState({
                    databaseType,
                    tables,
                    relationships,
                }),
                command,
            });
            if (result.status !== 'success') {
                return;
            }

            setTables(result.state.tables);

            const dbTable = await db.getTable({ diagramId, id: tableId });

            if (!dbTable) {
                return;
            }
            const updatedTable = result.state.tables.find(
                (table) => table.id === tableId
            );
            if (!updatedTable) {
                return;
            }

            const updatedAt = new Date();
            setDiagramUpdatedAt(updatedAt);
            await Promise.all([
                db.updateDiagram({ id: diagramId, attributes: { updatedAt } }),
                db.updateTable({
                    id: tableId,
                    attributes: updatedTable,
                }),
            ]);

            if (!!prevIndex && options.updateHistory) {
                addUndoAction({
                    action: 'updateIndex',
                    redoData: { tableId, indexId, index },
                    undoData: { tableId, indexId, index: prevIndex },
                    commandHistory: createSingleCommandHistory(command, result),
                });
                resetRedoStack();
            }
        },
        [
            db,
            diagramId,
            setTables,
            addUndoAction,
            resetRedoStack,
            getIndex,
            tables,
            relationships,
            databaseType,
            commandContext,
            setDiagramUpdatedAt,
        ]
    );

    return {
        addIndex,
        createIndex,
        getIndex,
        removeIndex,
        updateIndex,
    };
}

function createCommandState({
    databaseType,
    tables,
    relationships,
}: {
    databaseType: DatabaseType;
    tables: DBTable[];
    relationships: DBRelationship[];
}): DiagramFieldIndexRelationshipCommandState {
    return {
        databaseType,
        tables,
        relationships,
    };
}

function createSingleCommandHistory<TState>(
    redoCommand: DiagramCommand,
    result: CommandResult<TState>
): CommandHistoryBatch | undefined {
    return createCommandHistoryBatch([
        createCommandHistoryEntry({ redoCommand, result }),
    ]);
}
