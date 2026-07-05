import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NoteNode, type NoteNodeProps } from '../note-node';
import type { Note } from '@/lib/domain/note';

vi.mock('@/hooks/use-schemaflow', () => ({
    useSchemaFlow: () => ({
        updateNote: vi.fn(),
        removeNote: vi.fn(),
        readonly: true,
    }),
}));

vi.mock('@/hooks/use-canvas', () => ({
    useCanvas: () => ({
        events: {
            useSubscription: vi.fn(),
        },
    }),
}));

vi.mock('@/hooks/use-theme', () => ({
    useTheme: () => ({
        effectiveTheme: 'light',
    }),
}));

const renderNote = (content: string) => {
    const note: Note = {
        id: 'note-1',
        content,
        x: 0,
        y: 0,
        width: 240,
        height: 180,
        color: '#8eb7ff',
    };

    const props = {
        data: { note },
        selected: false,
        dragging: false,
    } as NoteNodeProps;

    return render(<NoteNode {...props} />);
};

describe('NoteNode markdown safety', () => {
    it('does not render raw HTML elements from note markdown', () => {
        const { container } = renderNote(`
# Safe note

<script>alert(1)</script>
<iframe src="https://attacker.example"></iframe>
<img src=x onerror=alert(1)>
`);

        expect(
            screen.getByRole('heading', { name: 'Safe note' })
        ).toBeVisible();
        expect(container.querySelector('script')).toBeNull();
        expect(container.querySelector('iframe')).toBeNull();
        expect(container.querySelector('img')).toBeNull();
    });

    it('keeps safe links and blocks dangerous link protocols', () => {
        renderNote(`
[safe](https://schemaflow.io)
[email](mailto:security@example.com)
[bad](javascript:alert(1))
`);

        expect(screen.getByRole('link', { name: 'safe' })).toHaveAttribute(
            'href',
            'https://schemaflow.io'
        );
        expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
            'href',
            'mailto:security@example.com'
        );
        expect(screen.getByText('bad')).not.toHaveAttribute('href');
    });
});
