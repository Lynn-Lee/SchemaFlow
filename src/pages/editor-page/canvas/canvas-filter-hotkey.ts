import type React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const useCanvasFilterHotkey = ({
    operatingSystem,
    setShowFilter,
}: {
    operatingSystem: string;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    useHotkeys(
        operatingSystem === 'mac' ? 'meta+f' : 'ctrl+f',
        () => {
            setShowFilter((prev) => !prev);
        },
        {
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );
};
