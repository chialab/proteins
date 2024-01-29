import { off, on, trigger } from '@chialab/proteins';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Unit: Events', () => {
    const context = {};
    const check = {};

    let callback1, callback2, callback3, callback4;

    const prepareFn =
        (number) =>
        (...args) => {
            check[number] = args;
        };

    beforeEach(() => {
        for (const k in check) {
            delete check[k];
        }
        off(context);
        callback1 = prepareFn(1);
        callback2 = prepareFn(2);
        callback3 = prepareFn(3);
        callback4 = prepareFn(4);
    });

    describe('on', () => {
        test('should add simple callback', async () => {
            on(context, 'test1', callback1);
            await trigger(context, 'test1', 2);
            expect(check['1']).toEqual([2]);
        });

        test('should add callback with one argument', async () => {
            on(context, 'test2', callback2);
            await trigger(context, 'test2', 'callback');
            expect(check['2']).toEqual(['callback']);
        });

        test('should add multiple callbacks with more arguments', async () => {
            on(context, 'test3', callback3);
            on(context, 'test3', callback4);
            await trigger(context, 'test3', 1, 4, 2);
            expect(check['3']).toEqual([1, 4, 2]);
            expect(check['4']).toEqual([1, 4, 2]);
        });

        test('should throws for not function callback', () => {
            expect(() => on(context, 'event', 'not a function')).toThrow(TypeError);
        });
    });

    describe('off', () => {
        test('should remove a callback', async () => {
            on(context, 'test3', callback3);
            on(context, 'test3', callback4);
            off(context, 'test3', callback3);
            await trigger(context, 'test3', 1, 4, 2);
            expect(check['3']).toBeUndefined();
            expect(check['4']).toEqual([1, 4, 2]);
        });

        test('should remove an event', async () => {
            on(context, 'test2', callback2);
            off(context, 'test2');
            await trigger(context, 'test2', 'callback');
            expect(check['2']).toBeUndefined();
        });

        test('should remove all events', async () => {
            on(context, 'test1', callback1);
            on(context, 'test2', callback2);
            on(context, 'test3', callback3);
            on(context, 'test4', callback3);
            off(context);
            await trigger(context, 'test1', 2);
            await trigger(context, 'test3', 1, 4, 2);
            expect(check['1']).toBeUndefined();
            expect(check['2']).toBeUndefined();
            expect(check['3']).toBeUndefined();
            expect(check['4']).toBeUndefined();
        });
    });

    describe('trigger', () => {
        test('should return a promise', () => {
            const res = trigger(context, 'eventWithNoCallbacks');
            expect(res).toBeInstanceOf(Promise);
        });

        test('should resolve all callbacks results', async () => {
            on(context, 'test', (num) => num ** 2);
            on(context, 'test', (num) => Promise.resolve(num ** 3));
            on(context, 'test', (num) => Promise.resolve(num ** 4));
            const result = await trigger(context, 'test', 2);
            expect(result).toEqual([4, 8, 16]);
        });

        test('remove a callback during a trigger should skip that callback', async () => {
            on(context, 'change', callback1);
            on(context, 'change', function (...args) {
                off(context, 'change', callback3);
                return callback2.call(this, ...args);
            });
            on(context, 'change', callback3);
            on(context, 'change', callback4);

            await trigger(context, 'change', 2);
            expect(check['1']).toEqual([2]);
            expect(check['2']).toEqual([2]);
            expect(check['3']).toBeUndefined();
            expect(check['4']).toEqual([2]);
        });

        test('should exec synchronous callbacks', async () => {
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
            expect(check['1']).toEqual([2]);
            expect(check['2']).toEqual(['callback']);
            expect(check['3']).toEqual([1, 4, 2]);
            expect(check['4']).toEqual([1, 4, 2]);
        });
    });
});
