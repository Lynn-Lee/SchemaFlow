import { afterEach, describe, expect, it, vi } from 'vitest';
import { deepCopy, getWorkspaceId, safeOpenUrl } from '../utils';

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

describe('deepCopy', () => {
    it('preserves Date instances in nested objects and arrays', () => {
        const createdAt = new Date('2026-07-05T04:00:00.000Z');
        const updatedAt = new Date('2026-07-05T04:30:00.000Z');

        const diagram = {
            id: 'diagram-1',
            createdAt,
            metadata: {
                updatedAt,
                history: [createdAt],
            },
        };
        const copy = deepCopy(diagram);

        expect(copy).not.toBe(diagram);
        expect(copy.metadata).not.toBe(diagram.metadata);
        expect(copy.metadata.history).not.toBe(diagram.metadata.history);
        expect(copy.createdAt).toBeInstanceOf(Date);
        expect(copy.createdAt).not.toBe(createdAt);
        expect(copy.createdAt.toISOString()).toBe(createdAt.toISOString());
        expect(copy.metadata.updatedAt).toBeInstanceOf(Date);
        expect(copy.metadata.history[0]).toBeInstanceOf(Date);
    });
});
