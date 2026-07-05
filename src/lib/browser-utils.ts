import { customAlphabet } from 'nanoid';

const randomId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 25);
const UUID_KEY = 'uuid';

export const getWorkspaceId = (): string => {
    let workspaceId = localStorage.getItem(UUID_KEY);

    if (!workspaceId) {
        workspaceId = randomId(8);
        localStorage.setItem(UUID_KEY, workspaceId);
    }

    return workspaceId;
};

export const generateDiagramId = () => {
    const prefix = getWorkspaceId();

    return `${prefix}${randomId(4)}`;
};

export const getOperatingSystem = (): 'mac' | 'windows' | 'unknown' => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Mac OS X')) {
        return 'mac';
    }
    if (userAgent.includes('Windows')) {
        return 'windows';
    }
    return 'unknown';
};

export const safeOpenUrl = (url: string): Window | null =>
    window.open(url, '_blank', 'noopener,noreferrer');
