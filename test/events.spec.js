/* eslint-env mocha */
import { on, off, trigger } from '../src/events.js';
import chai from 'chai/chai';

const { assert } = chai;

describe('Unit: Events', () => {
    const context = {};
    const check = {};

    function prepareFn(number) {
        return (...args) => {
            check[number] = args;
        };
    }

    const callback1 = prepareFn(1);
    const callback2 = prepareFn(2);
    const callback3 = prepareFn(3);
    const callback4 = prepareFn(4);

    beforeEach(() => {
        for (let k in check) {
            delete check[k];
        }
        off(context);
    });

    describe('on', () => {
        it('should add simple callback', async () => {
            on(context, 'test1', callback1);
            await trigger(context, 'test1', 2);
            assert.deepEqual(check['1'], [2]);
        });

        it('should add callback with one argument', async () => {
            on(context, 'test2', callback2);
            await trigger(context, 'test2', 'callback');
            assert.deepEqual(check['2'], ['callback']);
        });

        it('should add multiple callbacks with more arguments', async () => {
            on(context, 'test3', callback3);
            on(context, 'test3', callback4);
            await trigger(context, 'test3', 1, 4, 2);
            assert.deepEqual(check['3'], [1, 4, 2]);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });

        it('should throws for not function callback', () => {
            assert.throws(() => on(context, 'event', 4), TypeError);
        });
    });

    describe('off', () => {
        it('should remove a callback', async () => {
            on(context, 'test3', callback3);
            on(context, 'test3', callback4);
            off(context, 'test3', callback3);
            await trigger(context, 'test3', 1, 4, 2);
            assert.equal(check['3'], undefined);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });

        it('should remove an event', async () => {
            on(context, 'test2', callback2);
            off(context, 'test2');
            await trigger(context, 'test2', 'callback');
            assert.equal(check['2'], undefined);
        });

        it('should remove all events', async () => {
            on(context, 'test1', callback1);
            on(context, 'test2', callback2);
            on(context, 'test3', callback3);
            on(context, 'test4', callback3);
            off(context);
            await trigger(context, 'test1', 2),
            await trigger(context, 'test3', 1, 4, 2),
            assert.equal(check['1'], undefined);
            assert.equal(check['2'], undefined);
            assert.equal(check['3'], undefined);
            assert.equal(check['4'], undefined);
        });
    });

    describe('trigger', () => {
        it('should return a promise', () => {
            let res = trigger(context, 'eventWithNoCallbacks');
            assert(res instanceof Promise);
        });

        it('should resolve all callbacks results', async () => {
            on(context, 'test', (num) => num ** 2);
            on(context, 'test', (num) => Promise.resolve(num ** 3));
            on(context, 'test', (num) => Promise.resolve(num ** 4));
            let result = await trigger(context, 'test', 2);
            assert.deepEqual(result, [4, 8, 16]);
        });

        it('remove a callback during a trigger should skip that callback', async () => {
            on(context, 'change', callback1);
            on(context, 'change', function(...args) {
                off(context, 'change', callback3);
                return callback2.call(this, ...args);
            });
            on(context, 'change', callback3);
            on(context, 'change', callback4);

            await trigger(context, 'change', 2);
            assert.equal(check['1'], 2);
            assert.equal(check['2'], 2);
            assert.equal(check['3'], undefined);
            assert.equal(check['4'], 2);
        });

        it('should exec synchronous callbacks', async () => {
            on(context, 'test1', (...args) => {
                trigger(context, 'test2', 'callback');
                return callback1(...args);
            });
            on(context, 'test2', (...args) => {
                trigger(context, 'test3', 1, 4, 2);
                return callback2(...args);
            });
            on(context, 'test3', callback3);
            on(context, 'test3', callback4);
            trigger(context, 'test1', 2);
            assert.deepEqual(check['1'], [2]);
            assert.deepEqual(check['2'], ['callback']);
            assert.deepEqual(check['3'], [1, 4, 2]);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });
    });
});
