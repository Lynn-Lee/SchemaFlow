import { type ClassValue, clsx } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';
const randomId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 25);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emptyFn = (): any => undefined;

export const generateId = () => randomId();

export const deepCopy = <T>(obj: T): T => {
    if (obj instanceof Date) {
        return new Date(obj) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepCopy(item)) as T;
    }

    if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, deepCopy(value)])
        ) as T;
    }

    return obj;
};

export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    waitFor: number
) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
};

export const removeDups = <T>(array: T[]): T[] => {
    return [...new Set(array)];
};

export const decodeBase64ToUtf16LE = (base64: string) => {
    const binaryString = atob(base64);

    const charCodes = new Uint16Array(binaryString.length / 2);

    for (let i = 0; i < charCodes.length; i++) {
        charCodes[i] =
            binaryString.charCodeAt(i * 2) +
            (binaryString.charCodeAt(i * 2 + 1) << 8);
    }

    return String.fromCharCode(...charCodes);
};

export const decodeBase64ToUtf8 = (base64: string) => {
    const binaryString = atob(base64);

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
};

export const waitFor = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);

    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
};

export function mergeRefs<T>(
    ...inputRefs: (React.Ref<T> | undefined)[]
): React.Ref<T> | React.RefCallback<T> {
    const filteredInputRefs = inputRefs.filter(Boolean);

    if (filteredInputRefs.length <= 1) {
        const firstRef = filteredInputRefs[0];

        return firstRef || null;
    }

    return function mergedRefs(ref) {
        for (const inputRef of filteredInputRefs) {
            if (typeof inputRef === 'function') {
                inputRef(ref);
            } else if (inputRef) {
                (inputRef as React.MutableRefObject<T | null>).current = ref;
            }
        }
    };
}

export const isStringEmpty = (str: string | undefined | null): boolean => {
    return !str || str.trim().length === 0;
};

export const areBooleansEqual = (
    a: boolean | undefined | null,
    b: boolean | undefined | null
): boolean => {
    const boolA = a ?? false;
    const boolB = b ?? false;
    return boolA === boolB;
};
