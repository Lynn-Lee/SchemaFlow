import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

const defaultEvents = ['mousedown', 'touchstart'] as const;

export const useClickAway = <E extends Event = Event>(
    ref: RefObject<HTMLElement | null>,
    onClickAway: (event: E) => void,
    events: readonly string[] = defaultEvents
) => {
    const savedCallback = useRef(onClickAway);

    useEffect(() => {
        savedCallback.current = onClickAway;
    }, [onClickAway]);

    useEffect(() => {
        const handler = (event: Event) => {
            const element = ref.current;
            if (!element || element.contains(event.target as Node | null)) {
                return;
            }

            savedCallback.current(event as E);
        };

        for (const eventName of events) {
            document.addEventListener(eventName, handler);
        }

        return () => {
            for (const eventName of events) {
                document.removeEventListener(eventName, handler);
            }
        };
    }, [events, ref]);
};
