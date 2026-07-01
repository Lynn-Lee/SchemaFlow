export interface AISchemaSummary {
    tableCount: number;
    fieldCount: number;
    relationshipCount: number;
}

export type AIExportMode =
    | 'disabled'
    | 'byok-session'
    | {
          type: 'self-hosted-gateway';
          endpoint: string;
          modelName?: string;
      };

export type AIExportRequest =
    | {
          mode: 'byok-session';
          endpoint: string;
          apiKey: string;
          schemaSummary: AISchemaSummary;
      }
    | {
          mode: 'self-hosted-gateway';
          endpoint: string;
          modelName?: string;
          schemaSummary: AISchemaSummary;
      };

interface BuildAIExportRequestOptions {
    mode: AIExportMode;
    schemaSummary: AISchemaSummary;
    confirmedSchemaTransfer: boolean;
}

let byokSessionKey: string | undefined;

export const setBYOKSessionKey = (apiKey: string) => {
    byokSessionKey = apiKey;
};

export const getBYOKSessionKey = () => byokSessionKey;

export const clearBYOKSessionKey = () => {
    byokSessionKey = undefined;
};

export const buildAIExportRequest = ({
    mode,
    schemaSummary,
    confirmedSchemaTransfer,
}: BuildAIExportRequestOptions): AIExportRequest => {
    if (mode === 'disabled') {
        throw new Error('AI-assisted SQL export is disabled');
    }

    if (!confirmedSchemaTransfer) {
        throw new Error('Confirm schema transfer before AI-assisted export');
    }

    if (mode === 'byok-session') {
        const apiKey = getBYOKSessionKey();

        if (!apiKey) {
            throw new Error(
                'BYOK session key is required for AI-assisted export'
            );
        }

        return {
            mode: 'byok-session',
            endpoint: 'https://api.openai.com/v1',
            apiKey,
            schemaSummary,
        };
    }

    if (!mode.endpoint) {
        throw new Error('Self-hosted Gateway endpoint is required');
    }

    return {
        mode: 'self-hosted-gateway',
        endpoint: mode.endpoint,
        modelName: mode.modelName,
        schemaSummary,
    };
};
