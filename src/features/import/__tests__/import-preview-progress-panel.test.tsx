import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImportPreviewProgressPanel } from '../import-preview-progress-panel';

describe('ImportPreviewProgressPanel', () => {
    it('shows import preview progress with a cancel action', () => {
        const onCancel = vi.fn();

        render(
            <ImportPreviewProgressPanel
                progress={{
                    stage: 'parsing',
                    message: 'Parsing import input',
                }}
                onCancel={onCancel}
            />
        );

        expect(screen.getByText('Building import preview')).toBeVisible();
        expect(screen.getByText('Parsing import input')).toBeVisible();
        expect(
            screen.getByRole('button', { name: 'Cancel import preview' })
        ).toBeVisible();
    });
});
