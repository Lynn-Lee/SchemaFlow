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

const privateIpv4Ranges = [
    /^10\./,
    /^127\./,
    /^169\.254\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
];

export const validateGatewayEndpoint = (endpoint: string) => {
    const trimmedEndpoint = endpoint.trim();

    if (trimmedEndpoint.length === 0) {
        return 'Self-hosted Gateway endpoint is required';
    }

    let url: URL;
    try {
        url = new URL(trimmedEndpoint);
    } catch {
        return 'Self-hosted Gateway endpoint must be a public HTTPS endpoint';
    }

    const hostname = url.hostname.toLowerCase();
    const isLocalhost = hostname === 'localhost' || hostname.endsWith('.local');
    const isPrivateIpv4 = privateIpv4Ranges.some((range) =>
        range.test(hostname)
    );
    const isLoopbackIpv6 = hostname === '[::1]' || hostname === '::1';

    if (
        url.protocol !== 'https:' ||
        isLocalhost ||
        isPrivateIpv4 ||
        isLoopbackIpv6
    ) {
        return 'Self-hosted Gateway endpoint must be a public HTTPS endpoint';
    }

    return undefined;
};

let byokSessionKey: string | undefined;

export const setBYOKSessionKey = (apiKey: string) => {
    const trimmedKey = apiKey.trim();
    byokSessionKey = trimmedKey.length > 0 ? trimmedKey : undefined;
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

    const endpointError = validateGatewayEndpoint(mode.endpoint);
    if (endpointError) {
        throw new Error(endpointError);
    }

    return {
        mode: 'self-hosted-gateway',
        endpoint: mode.endpoint.trim(),
        modelName: mode.modelName,
        schemaSummary,
    };
};
