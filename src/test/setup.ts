import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

const createMemoryStorage = (): Storage => {
    const store = new Map<string, string>();

    return {
        get length() {
            return store.size;
        },
        clear() {
            store.clear();
        },
        getItem(key: string) {
            return store.get(key) ?? null;
        },
        key(index: number) {
            return Array.from(store.keys())[index] ?? null;
        },
        removeItem(key: string) {
            store.delete(key);
        },
        setItem(key: string, value: string) {
            store.set(key, String(value));
        },
    };
};

const localStorageMock = createMemoryStorage();
const sessionStorageMock = createMemoryStorage();

Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageMock,
});

Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: sessionStorageMock,
});

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
});

afterEach(() => {
    cleanup();
});
