import React from 'react';
import { Background, BackgroundVariant } from '@xyflow/react';
import { CanvasFilter } from './canvas-filter/canvas-filter';
import { CanvasEmptyFilterOverlay } from './canvas-empty-filter-overlay';

export interface CanvasFilterLayerProps {
    allTablesHiddenByFilter: boolean;
    showFilter: boolean;
    onResetFilter: () => void;
    onCloseFilter: () => void;
}

export const CanvasFilterLayer: React.FC<CanvasFilterLayerProps> = ({
    allTablesHiddenByFilter,
    showFilter,
    onResetFilter,
    onCloseFilter,
}) => {
    return (
        <>
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            {allTablesHiddenByFilter ? (
                <CanvasEmptyFilterOverlay onResetFilter={onResetFilter} />
            ) : null}
            {showFilter ? <CanvasFilter onClose={onCloseFilter} /> : null}
        </>
    );
};
