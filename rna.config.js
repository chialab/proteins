/**
 * @type {import('@chialab/rna-config-loader').ProjectConfig}
 */
const config = {
    entrypoints: [
        {
            input: 'src/index.js',
            output: 'dist/esm/proteins.js',
            format: 'esm',
            minify: true,
            platform: 'browser',
        },
        {
            input: 'src/index.js',
            output: 'dist/cjs/proteins.cjs',
            format: 'cjs',
            minify: true,
            platform: 'node',
        },
    ],
};

export default config;
