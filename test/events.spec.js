/* eslint-env mocha */
import { on, off, trigger } from '../src/events.js';
import chai from 'chai/chai';

const { assert } = chai;

describe('Unit: Events', () => {
    let obj = {};
    let check = {};

    function prepareFn(number) {
        return (...args) => {
            check[number] = args;
        };
    }

    let callback1 = prepareFn(1);
    let callback2 = prepareFn(2);
    let callback3 = prepareFn(3);
    let callback4 = prepareFn(4);

    on(obj, 'test1', callback1);
    on(obj, 'test2', callback2);
    on(obj, 'test3', callback3);
    on(obj, 'test3', callback4);

    function reset() {
        check = {
            1: false,
            2: false,
            3: false,
            4: false,
        };
        return Promise.resolve();
    }

    describe('on', () => {
        before((done) => {
            reset().then(() =>
                Promise.all([
                    trigger(obj, 'test1', 2),
                    trigger(obj, 'test2', 'callback'),
                    trigger(obj, 'test3', 1, 4, 2),
                ]).then(() => {
                    done();
                })
            );
        });

        it('should add simple callback', () => {
            assert.deepEqual(check['1'], [2]);
        });

        it('should add callback with one argument', () => {
            assert.deepEqual(check['2'], ['callback']);
        });

        it('should add multiple callbacks with more arguments', () => {
            assert.deepEqual(check['3'], [1, 4, 2]);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });
    });

    describe('off', () => {
        before((done) => {
            reset().then(() => {
                off(obj, 'test3', callback3);
                Promise.all([
                    trigger(obj, 'test3', 1, 4, 2),
                ]).then(() => {
                    done();
                });
            });
        });

        it('should remove a callback', () => {
            assert.equal(check['3'], false);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });
    });

    describe('off', () => {
        before((done) => {
            reset().then(() => {
                off(obj, 'test2');
                Promise.all([
                    trigger(obj, 'test2', 'callback'),
                ]).then(() => {
                    done();
                });
            });
        });

        it('should remove an event', () => {
            assert.equal(check['2'], false);
        });
    });

    describe('off', () => {
        before((done) => {
            reset().then(() => {
                off(obj);
                Promise.all([
                    trigger(obj, 'test1', 2),
                    trigger(obj, 'test3', 1, 4, 2),
                ]).then(() => {
                    done();
                });
            });
        });

        it('should remove all events', () => {
            assert.equal(check['1'], false);
            // assert.equal(check['4'], false);
        });
    });

    describe('not function callback', () => {
        it('should throws', () => {
            assert.throws(() => on(obj, 'event', 4), TypeError);
        });
    });

    describe('remove a callback during a trigger', () => {
        let scope = {};
        on(scope, 'change', callback1);
        on(scope, 'change', function(...args) {
            off(scope, 'change', callback3);
            return callback2.call(this, ...args);
        });
        on(scope, 'change', callback3);
        on(scope, 'change', callback4);

        before((done) => {
            reset().then(() => {
                Promise.all([
                    trigger(scope, 'change', 2),
                ]).then(() => {
                    done();
                });
            });
        });

        it('should skip that callback', () => {
            assert.equal(check['1'], 2);
            assert.equal(check['2'], 2);
            assert.equal(check['3'], false);
            assert.equal(check['4'], 2);
        });
    });
});
