import { schemaFlowContext } from '@/context/schemaflow-context/schemaflow-context';
import { useContext } from 'react';

export const useSchemaFlow = () => useContext(schemaFlowContext);
