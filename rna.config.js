/**
 * @type {import('@chialab/rna-config-loader').ProjectConfig}
 */
const config = {
    entrypoints: [
        {
            input: 'src/index.js',
            output: 'dist/esm/proteins.js',
            format: 'esm',
            platform: 'browser',
        },
        {
            input: 'src/index.js',
            output: 'dist/cjs/proteins.cjs',
            format: 'cjs',
            platform: 'node',
        },
    ],
    minify: true,
};

export default config;
