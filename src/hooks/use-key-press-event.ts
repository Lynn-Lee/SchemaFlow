import { useEffect, useRef } from 'react';

import type { KeyFilter } from './use-key-press';
import { useKeyPress } from './use-key-press';

type Handler = (event: KeyboardEvent) => void;

export const useKeyPressEvent = (
    key: KeyFilter,
    keydown?: Handler | null,
    keyup?: Handler | null,
    useKeyPressHook = useKeyPress
) => {
    const [pressed, event] = useKeyPressHook(key);
    const wasMounted = useRef(false);
    const keydownRef = useRef(keydown);
    const keyupRef = useRef(keyup);
    const eventRef = useRef(event);

    useEffect(() => {
        keydownRef.current = keydown;
        keyupRef.current = keyup;
        eventRef.current = event;
    }, [event, keydown, keyup]);

    useEffect(() => {
        if (!wasMounted.current) {
            wasMounted.current = true;
            return;
        }

        if (!eventRef.current) {
            return;
        }

        if (pressed) {
            keydownRef.current?.(eventRef.current);
            return;
        }

        keyupRef.current?.(eventRef.current);
    }, [pressed]);
};
