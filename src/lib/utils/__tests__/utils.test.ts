import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWorkspaceId, safeOpenUrl } from '../utils';

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

describe('safeOpenUrl', () => {
    it('opens external links in a new tab without opener access', () => {
        const open = vi.spyOn(window, 'open').mockImplementation(() => null);

        safeOpenUrl('https://docs.chartdb.io');

        expect(open).toHaveBeenCalledWith(
            'https://docs.chartdb.io',
            '_blank',
            'noopener,noreferrer'
        );
    });
});
