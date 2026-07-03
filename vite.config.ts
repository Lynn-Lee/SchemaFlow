import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import UnpluginInjectPreload from 'unplugin-inject-preload/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            filename: './stats/stats.html',
            open: false,
        }),
        UnpluginInjectPreload({
            files: [
                {
                    entryMatch: /logo-light.png$/,
                    outputMatch: /logo-light-.*.png$/,
                },
                {
                    entryMatch: /logo-dark.png$/,
                    outputMatch: /logo-dark-.*.png$/,
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            external: (id) => /__test__/.test(id),
            output: {
                manualChunks: (id) => {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (
                        id.includes('/react/') ||
                        id.includes('/react-dom/') ||
                        id.includes('/react-router-dom/')
                    ) {
                        return 'vendor-react';
                    }

                    if (
                        id.includes('/monaco-editor/') ||
                        id.includes('/@monaco-editor/react/')
                    ) {
                        return 'vendor-monaco';
                    }

                    if (id.includes('/node-sql-parser/')) {
                        return 'vendor-sql-parser';
                    }

                    if (
                        id.includes('/@dbml/core/') ||
                        id.includes('/@dbml/parse/')
                    ) {
                        return 'vendor-dbml';
                    }

                    if (
                        id.includes('/@radix-ui/') ||
                        id.includes('/lucide-react/')
                    ) {
                        return 'vendor-ui';
                    }

                    if (id.includes('/@xyflow/')) {
                        return 'vendor-xyflow';
                    }

                    if (
                        id.includes('/i18next/') ||
                        id.includes('/react-i18next/')
                    ) {
                        return 'vendor-i18n';
                    }

                    return undefined;
                },
                assetFileNames: (assetInfo) => {
                    if (
                        assetInfo.names &&
                        assetInfo.originalFileNames.some((name) =>
                            name.startsWith('src/assets/templates/')
                        )
                    ) {
                        return 'assets/[name][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
});
