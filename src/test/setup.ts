import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { i18n } from '@/i18n/i18n';

expect.extend(matchers);

// Component tests assert on rendered strings. Pin the test suite to English
// so those assertions stay deterministic regardless of the product's
// default UI language (which is Simplified Chinese for real users).
beforeEach(async () => {
    await i18n.changeLanguage('en');
});

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
