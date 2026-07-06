type BooleanRuntimeConfigInput = {
    runtimeValue?: string;
    legacyRuntimeValue?: string;
    buildTimeValue?: string;
    legacyBuildTimeValue?: string;
};

export const readBooleanRuntimeConfig = ({
    runtimeValue,
    legacyRuntimeValue,
    buildTimeValue,
    legacyBuildTimeValue,
}: BooleanRuntimeConfigInput): boolean =>
    (runtimeValue ??
        legacyRuntimeValue ??
        buildTimeValue ??
        legacyBuildTimeValue) === 'true';

export const OPENAI_API_ENDPOINT: string = import.meta.env
    .VITE_OPENAI_API_ENDPOINT;
export const LLM_MODEL_NAME: string = import.meta.env.VITE_LLM_MODEL_NAME;
export const IS_SCHEMAFLOW_IO: boolean =
    import.meta.env.VITE_IS_SCHEMAFLOW_IO === 'true';
export const APP_URL: string = import.meta.env.VITE_APP_URL;
export const HOST_URL: string = import.meta.env.VITE_HOST_URL ?? '';
export const HIDE_SCHEMAFLOW_CLOUD: boolean = readBooleanRuntimeConfig({
    runtimeValue: window?.env?.HIDE_SCHEMAFLOW_CLOUD,
    legacyRuntimeValue: window?.env?.HIDE_CHARTDB_CLOUD,
    buildTimeValue: import.meta.env.VITE_HIDE_SCHEMAFLOW_CLOUD,
    legacyBuildTimeValue: import.meta.env.VITE_HIDE_CHARTDB_CLOUD,
});
export const DISABLE_ANALYTICS: boolean =
    (window?.env?.DISABLE_ANALYTICS ??
        import.meta.env.VITE_DISABLE_ANALYTICS) === 'true';
