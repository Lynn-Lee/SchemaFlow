import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { useRef } from 'react';

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useClickAway } from '../use-click-away';
import { useKeyPressEvent } from '../use-key-press-event';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const removedHookPackages = [`react-${'use'}`, `@uidotdev/${'usehooks'}`];

const collectSourceFiles = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return collectSourceFiles(entryPath);
        }

        if (!/\.(ts|tsx)$/.test(entry.name)) {
            return [];
        }

        return [entryPath];
    });
};

describe('local hooks contract', () => {
    it('does not depend on removed hook packages', () => {
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
        ) as {
            dependencies?: Record<string, string>;
        };
        const sourceFiles = collectSourceFiles(srcDir);

        for (const packageName of removedHookPackages) {
            const sourceImports = sourceFiles.filter((file) =>
                new RegExp(`from\\s+['"]${packageName}['"]`).test(
                    fs.readFileSync(file, 'utf8')
                )
            );

            expect(packageJson.dependencies).not.toHaveProperty(packageName);
            expect(sourceImports).toEqual([]);
        }
    });

    it('runs click-away handlers only for events outside the referenced element', () => {
        const onClickAway = vi.fn();

        const Fixture = () => {
            const ref = useRef<HTMLDivElement>(null);
            useClickAway(ref, onClickAway);

            return (
                <>
                    <div ref={ref}>
                        <button type="button">inside</button>
                    </div>
                    <button type="button">outside</button>
                </>
            );
        };

        const { getByText } = render(<Fixture />);

        fireEvent.mouseDown(getByText('inside'));
        expect(onClickAway).not.toHaveBeenCalled();

        fireEvent.mouseDown(getByText('outside'));
        expect(onClickAway).toHaveBeenCalledTimes(1);
    });

    it('runs key press handlers for matching keydown and keyup events', () => {
        const onEnter = vi.fn();
        const onEscapeUp = vi.fn();

        const Fixture = () => {
            useKeyPressEvent('Enter', onEnter);
            useKeyPressEvent('Escape', null, onEscapeUp);

            return <div>keyboard target</div>;
        };

        render(<Fixture />);

        fireEvent.keyDown(window, { key: 'Tab' });
        expect(onEnter).not.toHaveBeenCalled();

        fireEvent.keyDown(window, { key: 'Enter' });
        expect(onEnter).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(window, { key: 'Escape' });
        fireEvent.keyUp(window, { key: 'Escape' });
        expect(onEscapeUp).toHaveBeenCalledTimes(1);
    });
});
