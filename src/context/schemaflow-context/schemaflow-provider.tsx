import React from 'react';
import type { Diagram } from '@/lib/domain/diagram';
import {
    schemaFlowContext,
    schemaFlowStoreContext,
    createSchemaFlowStore,
} from './schemaflow-context';
import { useSchemaFlowProviderValue } from './use-schemaflow-provider-value';

export interface SchemaFlowProviderProps {
    diagram?: Diagram;
    readonly?: boolean;
}

export const SchemaFlowProvider: React.FC<
    React.PropsWithChildren<SchemaFlowProviderProps>
> = ({ children, diagram, readonly }) => {
    const value = useSchemaFlowProviderValue({ diagram, readonly });
    const storeRef = React.useRef(createSchemaFlowStore(value));

    React.useLayoutEffect(() => {
        storeRef.current.setValue(value);
    }, [value]);

    return (
        <schemaFlowStoreContext.Provider value={storeRef.current}>
            <schemaFlowContext.Provider value={value}>
                {children}
            </schemaFlowContext.Provider>
        </schemaFlowStoreContext.Provider>
    );
};
