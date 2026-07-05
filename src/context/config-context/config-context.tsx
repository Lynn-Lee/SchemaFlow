import { createContext } from 'react';
import { emptyFn } from '@/lib/utils';
import type { SchemaFlowConfig } from '@/lib/domain/config';

export interface ConfigContext {
    config?: SchemaFlowConfig;
    updateConfig: (params: {
        config?: Partial<SchemaFlowConfig>;
        updateFn?: (config: SchemaFlowConfig) => SchemaFlowConfig;
    }) => Promise<void>;
}

export const ConfigContext = createContext<ConfigContext>({
    config: undefined,
    updateConfig: emptyFn,
});
