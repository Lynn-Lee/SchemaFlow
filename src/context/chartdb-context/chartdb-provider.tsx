import React from 'react';
import type { Diagram } from '@/lib/domain/diagram';
import {
    chartDBContext,
    chartDBStoreContext,
    createChartDBStore,
} from './chartdb-context';
import { useChartDBProviderValue } from './use-chartdb-provider-value';

export interface ChartDBProviderProps {
    diagram?: Diagram;
    readonly?: boolean;
}

export const ChartDBProvider: React.FC<
    React.PropsWithChildren<ChartDBProviderProps>
> = ({ children, diagram, readonly }) => {
    const value = useChartDBProviderValue({ diagram, readonly });
    const storeRef = React.useRef(createChartDBStore(value));

    React.useLayoutEffect(() => {
        storeRef.current.setValue(value);
    }, [value]);

    return (
        <chartDBStoreContext.Provider value={storeRef.current}>
            <chartDBContext.Provider value={value}>
                {children}
            </chartDBContext.Provider>
        </chartDBStoreContext.Provider>
    );
};
