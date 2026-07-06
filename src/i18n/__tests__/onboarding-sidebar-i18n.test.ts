import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

describe('onboarding dialog and editor sidebar i18n', () => {
    it('defines onboarding copy in the fallback locale', () => {
        expect(en.translation.onboarding.title).toBe(
            'Start a SchemaFlow diagram'
        );
        expect(en.translation.onboarding.start_options.blank.title).toBe(
            'New blank diagram'
        );
    });

    it('defines onboarding copy in Simplified Chinese, not left in English', () => {
        expect(zh_CN.translation.onboarding.title).not.toBe(
            en.translation.onboarding.title
        );
        expect(zh_CN.translation.onboarding.start_options.blank.title).not.toBe(
            en.translation.onboarding.start_options.blank.title
        );
        expect(
            zh_CN.translation.onboarding.start_options.import.description
        ).not.toBe(en.translation.onboarding.start_options.import.description);
    });

    it('defines editor sidebar footer copy in Simplified Chinese for non-brand labels', () => {
        expect(zh_CN.translation.editor_sidebar.docs).not.toBe(
            en.translation.editor_sidebar.docs
        );
        expect(zh_CN.translation.editor_sidebar.settings).not.toBe(
            en.translation.editor_sidebar.settings
        );
    });

    it('defines new diagram database selection labels in Simplified Chinese', () => {
        expect(
            zh_CN.translation.new_diagram_dialog.database_selection
                .transactional
        ).not.toBe(
            en.translation.new_diagram_dialog.database_selection.transactional
        );
        expect(
            zh_CN.translation.new_diagram_dialog.database_selection
                .more_databases
        ).not.toBe(
            en.translation.new_diagram_dialog.database_selection.more_databases
        );
    });
});
