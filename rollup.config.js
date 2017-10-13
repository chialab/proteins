/* eslint-env node */
/* eslint-disable no-unused-vars */

const env = process.env;
const project = require('./package.json');

const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const common = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const istanbul = require('rollup-plugin-istanbul');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const inject = require('rollup-plugin-inject');

const TEST_ENV = (env.NODE_ENV === 'test');
const PRODUCTION_ENV = (env.NODE_ENV === 'production');
const BROWSER_TARGET = (env.TARGET === 'browser');
const NODE_TARGET = (env.TARGET === 'node');

module.exports = {
    name: camelize(project.main),
    input: TEST_ENV ? './test/suite.js' : project.module,
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    format: 'umd',
    strict: false,
    plugins: [
        NODE_TARGET ? builtins() : {},
        json(),
        nodeResolve(),
        common({
            include: [
                'node_modules/promise-polyfill/**',
                'test/polyfills.js',
            ],
        }),
        TEST_ENV ? istanbul({
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
        (TEST_ENV && NODE_TARGET) ? inject({
            include: 'test/**/*.js',
            assert: 'assert',
        }) : {},
        PRODUCTION_ENV ? uglify({
            output: {
                comments: /@license/,
            },
        }) : {},
    ],
};

function camelize(str) {
    return str.split('/').pop().replace(/(^[a-z0-9]|[-_]([a-z0-9]))/g, (g) => (g[1] || g[0]).toUpperCase());
}
