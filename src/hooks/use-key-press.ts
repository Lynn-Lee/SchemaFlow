import { useEffect, useMemo, useState } from 'react';

export type KeyFilter =
    | null
    | undefined
    | boolean
    | string
    | ((event: KeyboardEvent) => boolean);

const createKeyPredicate = (keyFilter: KeyFilter) => {
    if (typeof keyFilter === 'function') {
        return keyFilter;
    }

    if (typeof keyFilter === 'string') {
        return (event: KeyboardEvent) => event.key === keyFilter;
    }

    return keyFilter ? () => true : () => false;
};

export const useKeyPress = (
    keyFilter: KeyFilter
): [boolean, KeyboardEvent | null] => {
    const [state, setState] = useState<[boolean, KeyboardEvent | null]>([
        false,
        null,
    ]);
    const predicate = useMemo(() => createKeyPredicate(keyFilter), [keyFilter]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (predicate(event)) {
                setState([true, event]);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (predicate(event)) {
                setState([false, event]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [predicate]);

    return state;
};
