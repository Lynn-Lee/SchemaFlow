import React from 'react';
import type { Diagram } from '@/lib/domain/diagram';
import { chartDBContext } from './chartdb-context';
import { useChartDBProviderValue } from './use-chartdb-provider-value';

export interface ChartDBProviderProps {
    diagram?: Diagram;
    readonly?: boolean;
}

export const ChartDBProvider: React.FC<
    React.PropsWithChildren<ChartDBProviderProps>
> = ({ children, diagram, readonly }) => {
    const value = useChartDBProviderValue({ diagram, readonly });

    return (
        <chartDBContext.Provider value={value}>
            {children}
        </chartDBContext.Provider>
    );
};
