import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCanvasFilterHotkey } from '../canvas-filter-hotkey';

vi.mock('react-hotkeys-hook', () => ({
    useHotkeys: vi.fn(),
}));

describe('useCanvasFilterHotkey', () => {
    beforeEach(() => {
        vi.mocked(useHotkeys).mockClear();
    });

    it('registers meta+f on macOS and toggles the filter panel', () => {
        const setShowFilter = vi.fn();

        renderHook(() =>
            useCanvasFilterHotkey({
                operatingSystem: 'mac',
                setShowFilter,
            })
        );

        expect(useHotkeys).toHaveBeenCalledWith(
            'meta+f',
            expect.any(Function),
            {
                preventDefault: true,
                enableOnFormTags: true,
            },
            []
        );

        const handler = vi.mocked(useHotkeys).mock.calls[0][1];
        handler({} as KeyboardEvent, {} as never);

        expect(setShowFilter).toHaveBeenCalledWith(expect.any(Function));
        const updater = setShowFilter.mock.calls[0][0];
        expect(updater(false)).toBe(true);
    });

    it('registers ctrl+f outside macOS', () => {
        renderHook(() =>
            useCanvasFilterHotkey({
                operatingSystem: 'windows',
                setShowFilter: vi.fn(),
            })
        );

        expect(useHotkeys).toHaveBeenCalledWith(
            'ctrl+f',
            expect.any(Function),
            expect.any(Object),
            []
        );
    });
});
