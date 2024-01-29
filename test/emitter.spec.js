import { Factory } from '@chialab/proteins';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Unit: Emitter', () => {
    let check = {};
    let obj, callback1, callback2, callback3, callback4;

    const prepareFn =
        (number) =>
        (...args) => {
            check[number] = args;
        };

    beforeAll(() => {
        callback1 = prepareFn(1);
        callback2 = prepareFn(2);
        callback3 = prepareFn(3);
        callback4 = prepareFn(4);

        obj = new Factory.Emitter();
        obj.on('test1', callback1);
        obj.on('test2', callback2);
        obj.on('test3', callback3);
        obj.on('test3', callback4);
    });

    function reset() {
        check = {
            1: false,
            2: false,
            3: false,
            4: false,
        };
    }

    describe('on', () => {
        beforeAll(async () => {
            reset();
            await Promise.all([
                obj.trigger('test1', 2),
                obj.trigger('test2', 'callback'),
                obj.trigger('test3', 1, 4, 2),
            ]);
        });

        test('should add simple callback', () => {
            expect(check['1']).toEqual([2]);
        });

        test('should add callback with one argument', () => {
            expect(check['2']).toEqual(['callback']);
        });

        test('should add multiple callbacks with more arguments', () => {
            expect(check['3']).toEqual([1, 4, 2]);
            expect(check['4']).toEqual([1, 4, 2]);
        });
    });

    describe('off', () => {
        test('should remove a callback', async () => {
            reset();
            obj.off('test3', callback3);
            Promise.all([obj.trigger('test3', 1, 4, 2)]);
            expect(check['3']).toEqual(false);
            expect(check['4']).toEqual([1, 4, 2]);
        });

        test('should remove an event', async () => {
            reset();
            obj.off('test2');
            await Promise.all([obj.trigger('test2', 'callback')]);
            expect(check['2']).toEqual(false);
        });

        test('should remove all events', async () => {
            reset();
            obj.destroy();
            await Promise.all([obj.trigger('test1', 2), obj.trigger('test3', 1, 4, 2)]);
            expect(check['1']).toEqual(false);
            // assert.equal(check['4'], false);
        });
    });

    describe('not function callback', () => {
        test('should throws', () => {
            expect(() => obj.on('event', 4)).toThrow(TypeError);
        });
    });
});
