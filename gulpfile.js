/* eslint-env node */

/**
 * Copyright 2017 Chialab. All Rights Reserved.
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const path = require('path');
const del = require('del');
const mkdirp = require('mkdirp');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rollup = require('rollup-stream');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const karma = require('karma');

const env = process.env;
const karmaConfig = path.resolve('./karma.conf.js');
const DIST_PATH = 'dist';
const SRC_PATH = 'src';
const TMP_PATH = '.tmp';
const ENTRY = 'proteins.js';

function clean() {
    let p = path.join(DIST_PATH);
    return del([p]).then(() => {
        mkdirp.sync(p);
        return Promise.resolve();
    });
}

function lint() {
    return gulp.src(SRC_PATH)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function compile() {
    return rollup('rollup.config.js')
        .on('error', (err) => {
            // eslint-disable-next-line
            console.error(err);
        })
        .pipe(source(ENTRY))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true,
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_PATH));
}

function min() {
    env.NODE_ENV = 'production';
    return compile();
}

function watch() {
    return compile(env.TMP_PATH)
        .on('end', () => {
            gulp.watch(path.join(SRC_PATH, '**/*.js'), () =>
                compile(env.TMP_PATH)
            );
        });
}

function unitNode() {
    env.NODE_ENV = 'test';
    env.TARGET = 'node';
    return rollup('rollup.config.js')
        .on('error', (err) => {
            // eslint-disable-next-line
            console.error(err);
        })
        .pipe(source('specs.js', TMP_PATH))
        .pipe(buffer())
        .pipe(gulp.dest(TMP_PATH))
        .pipe(mocha());
}

function unitBrowser(done) {
    env.NODE_ENV = 'test';
    env.TARGET = 'browser';
    new karma.Server({
        configFile: karmaConfig,
        singleRun: true,
    }, done).start();
}

gulp.task('clean', clean);
gulp.task('lint', lint);
gulp.task('js', ['clean', 'lint'], min);
gulp.task('js-watch', watch);
gulp.task('unit-node', unitNode);
gulp.task('unit-browser', unitBrowser);
gulp.task('dist', ['js']);

gulp.task('default', ['dist']);
