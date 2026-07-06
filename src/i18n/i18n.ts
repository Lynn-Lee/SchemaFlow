import i18n from 'i18next';
import type { BackendModule, ReadCallback } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import type { LanguageMetadata, LanguageTranslation } from './types';
import { zh_CN } from './locales/zh_CN';

const fallbackLanguageCode = 'zh_CN';

const toHtmlLang = (language: string): string => language.replace('_', '-');

const syncDocumentLanguage = (language?: string): void => {
    if (typeof document === 'undefined' || !language) {
        return;
    }

    document.documentElement.lang = toHtmlLang(language);
};

const experimentalLanguageCodes = new Set([
    'ar',
    'bn',
    'de',
    'es',
    'fr',
    'gu',
    'hi',
    'id_ID',
    'ja',
    'ko_KR',
    'mr',
    'ne',
    'pt_BR',
    'ru',
    'te',
    'tr',
    'uk',
    'vi',
    'zh_TW',
]);

const withStatus = (metadata: LanguageMetadata): LanguageMetadata => ({
    ...metadata,
    status: experimentalLanguageCodes.has(metadata.code)
        ? 'experimental'
        : 'stable',
});

export const languages: LanguageMetadata[] = [
    { name: 'English', nativeName: 'English', code: 'en' },
    { name: 'French', nativeName: 'Français', code: 'fr' },
    { name: 'German', nativeName: 'Deutsch', code: 'de' },
    { name: 'Spanish', nativeName: 'Español', code: 'es' },
    { name: 'Ukrainian', nativeName: 'Українська', code: 'uk' },
    { name: 'Russian', nativeName: 'Русский', code: 'ru' },
    { nativeName: 'Türkçe', name: 'Turkish', code: 'tr' },
    { name: 'Croatian', nativeName: 'Hrvatski', code: 'hr' },
    { name: 'Portuguese', nativeName: 'Português', code: 'pt_BR' },
    { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
    { name: 'Japanese', nativeName: '日本語', code: 'ja' },
    { name: 'Korean', nativeName: '한국어', code: 'ko_KR' },
    {
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        code: 'zh_CN',
    },
    {
        nativeName: '繁體中文',
        name: 'Chinese (Traditional)',
        code: 'zh_TW',
    },
    { name: 'Nepali', nativeName: 'नेपाली', code: 'ne' },
    { name: 'Marathi', nativeName: 'मराठी', code: 'mr' },
    { name: 'Indonesian', nativeName: 'Indonesia', code: 'id_ID' },
    { name: 'Telugu', nativeName: 'తెలుగు', code: 'te' },
    { name: 'Bengali', nativeName: 'বাংলা', code: 'bn' },
    { name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu' },
    { name: 'Vietnamese', nativeName: 'Tiếng Việt', code: 'vi' },
    { name: 'Arabic', nativeName: 'العربية', code: 'ar' },
].map(withStatus);

const localeLoaders: Record<string, () => Promise<LanguageTranslation>> = {
    ar: () => import('./locales/ar').then((module) => module.ar),
    bn: () => import('./locales/bn').then((module) => module.bn),
    de: () => import('./locales/de').then((module) => module.de),
    en: () => import('./locales/en').then((module) => module.en),
    es: () => import('./locales/es').then((module) => module.es),
    fr: () => import('./locales/fr').then((module) => module.fr),
    gu: () => import('./locales/gu').then((module) => module.gu),
    hi: () => import('./locales/hi').then((module) => module.hi),
    hr: () => import('./locales/hr').then((module) => module.hr),
    id_ID: () => import('./locales/id_ID').then((module) => module.id_ID),
    ja: () => import('./locales/ja').then((module) => module.ja),
    ko_KR: () => import('./locales/ko_KR').then((module) => module.ko_KR),
    mr: () => import('./locales/mr').then((module) => module.mr),
    ne: () => import('./locales/ne').then((module) => module.ne),
    pt_BR: () => import('./locales/pt_BR').then((module) => module.pt_BR),
    ru: () => import('./locales/ru').then((module) => module.ru),
    te: () => import('./locales/te').then((module) => module.te),
    tr: () => import('./locales/tr').then((module) => module.tr),
    uk: () => import('./locales/uk').then((module) => module.uk),
    vi: () => import('./locales/vi').then((module) => module.vi),
    zh_TW: () => import('./locales/zh_TW').then((module) => module.zh_TW),
};

const lazyLocaleBackend: BackendModule = {
    type: 'backend',
    init: () => undefined,
    read: (language: string, namespace: string, callback: ReadCallback) => {
        if (namespace !== 'translation') {
            callback(null, {});
            return;
        }

        if (language === fallbackLanguageCode) {
            callback(null, zh_CN.translation);
            return;
        }

        const loadLocale = localeLoaders[language];

        if (!loadLocale) {
            callback(`Unsupported language: ${language}`, null);
            return;
        }

        loadLocale()
            .then((resources) => callback(null, resources.translation))
            .catch((error: unknown) =>
                callback(
                    error instanceof Error
                        ? error
                        : `Failed to load language: ${language}`,
                    null
                )
            );
    },
};

i18n.use(lazyLocaleBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            zh_CN,
        },
        partialBundledLanguages: true,
        supportedLngs: languages.map((language) => language.code),
        ns: ['translation'],
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false,
        },
        fallbackLng: fallbackLanguageCode,
        // Only an explicit choice (query string or a previously saved
        // preference) overrides the default. Browser/OS language
        // ('navigator', 'htmlTag') is intentionally excluded so every
        // first-time visitor sees Chinese regardless of locale.
        detection: {
            order: ['querystring', 'localStorage'],
            caches: ['localStorage'],
        },
        debug: false,
    });

i18n.on('languageChanged', syncDocumentLanguage);
syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);

export { i18n };
