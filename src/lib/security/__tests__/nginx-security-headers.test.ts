import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) =>
    readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Nginx security headers', () => {
    it('allocates enough Node heap for the Docker production build', () => {
        const dockerfile = readProjectFile('Dockerfile');

        expect(dockerfile).toContain(
            'ENV NODE_OPTIONS=--max-old-space-size=4096'
        );
    });

    it('sets baseline browser security headers for the static app', () => {
        const nginxConfig = readProjectFile('default.conf.template');

        expect(nginxConfig).toContain('add_header Content-Security-Policy');
        expect(nginxConfig).toContain(
            'add_header X-Content-Type-Options "nosniff" always;'
        );
        expect(nginxConfig).toContain(
            'add_header Referrer-Policy "strict-origin-when-cross-origin" always;'
        );
        expect(nginxConfig).toContain(
            'add_header X-Frame-Options "SAMEORIGIN" always;'
        );
        expect(nginxConfig).toContain(
            'add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;'
        );
    });

    it('keeps the CSP compatible with Vite assets and HTTPS self-hosted gateways', () => {
        const nginxConfig = readProjectFile('default.conf.template');

        expect(nginxConfig).toContain("default-src 'self'");
        expect(nginxConfig).toContain("script-src 'self'");
        expect(nginxConfig).toContain("style-src 'self' 'unsafe-inline'");
        expect(nginxConfig).toContain("img-src 'self' data: blob:");
        expect(nginxConfig).toContain("font-src 'self' data:");
        expect(nginxConfig).toContain("connect-src 'self' https:");
        expect(nginxConfig).not.toContain("connect-src 'self' http: https:");
        expect(nginxConfig).toContain("worker-src 'self' blob:");
        expect(nginxConfig).toContain("object-src 'none'");
        expect(nginxConfig).toContain("base-uri 'self'");
        expect(nginxConfig).toContain("frame-ancestors 'self'");
    });

    it('prevents runtime config from being cached across deployments', () => {
        const nginxConfig = readProjectFile('default.conf.template');

        expect(nginxConfig).toContain('location /config.js');
        expect(nginxConfig).toContain(
            'add_header Cache-Control "no-store" always;'
        );
    });
});
