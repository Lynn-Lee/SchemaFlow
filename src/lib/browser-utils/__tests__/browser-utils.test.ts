import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    getOperatingSystem,
    getWorkspaceId,
    safeOpenUrl,
} from '../../browser-utils';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('getWorkspaceId', () => {
    it('creates and reuses a workspace id from localStorage', () => {
        const firstWorkspaceId = getWorkspaceId();
        const secondWorkspaceId = getWorkspaceId();

        expect(firstWorkspaceId).toHaveLength(8);
        expect(secondWorkspaceId).toBe(firstWorkspaceId);
        expect(localStorage.getItem('uuid')).toBe(firstWorkspaceId);
    });
});

describe('getOperatingSystem', () => {
    it('detects macOS and Windows user agents', () => {
        vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        );
        expect(getOperatingSystem()).toBe('mac');

        vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        );
        expect(getOperatingSystem()).toBe('windows');
    });
});

describe('safeOpenUrl', () => {
    it('opens external links in a new tab without opener access', () => {
        const open = vi.spyOn(window, 'open').mockImplementation(() => null);

        safeOpenUrl('https://github.com/Lynn-Lee/SchemaFlow/tree/main/docs');

        expect(open).toHaveBeenCalledWith(
            'https://github.com/Lynn-Lee/SchemaFlow/tree/main/docs',
            '_blank',
            'noopener,noreferrer'
        );
    });
});
