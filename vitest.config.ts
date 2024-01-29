import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@chialab/proteins': fileURLToPath(new URL('./src/index.js', import.meta.url)),
        },
    },
    test: {
        coverage: {
            all: false,
            include: ['src'],
            reporter: [['clover'], ['html']],
        },
    },
});
