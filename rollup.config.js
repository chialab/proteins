/* eslint-env node */

const env = process.env;

const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const istanbul = require('rollup-plugin-istanbul');
const json = require('rollup-plugin-json');

module.exports = {
    sourceMap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    format: 'umd',
    moduleName: 'Proteins',
    entry: './index.js',
    useStrict: false,
    plugins: [
        json(),
        nodeResolve(),
        (process.env.NODE_ENV === 'test') ? istanbul({
            include: [
                'src/**/*.js',
            ],
        }) : {},
        babel({
            include: [
                './index.js',
                'node_modules/**/*.{js,jsx}',
                'src/**/*.{js,jsx}',
                'test/**/*.{js,jsx}',
            ],
        }),
        env.min === 'true' ? uglify({
            output: {
                comments: /@license/,
            },
        }) : {},
    ],
};
