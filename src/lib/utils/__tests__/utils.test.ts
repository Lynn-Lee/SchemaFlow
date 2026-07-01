import { describe, expect, it } from 'vitest';
import { getWorkspaceId } from '../utils';

describe('getWorkspaceId', () => {
    it('creates and reuses a workspace id from localStorage', () => {
        const firstWorkspaceId = getWorkspaceId();
        const secondWorkspaceId = getWorkspaceId();

        expect(firstWorkspaceId).toHaveLength(8);
        expect(secondWorkspaceId).toBe(firstWorkspaceId);
        expect(localStorage.getItem('uuid')).toBe(firstWorkspaceId);
    });
});
