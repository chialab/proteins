import { assert } from '@esm-bundle/chai/esm/chai.js';
import { Factory } from '@chialab/proteins';

describe('Unit: Emitter', () => {
    let check = {};
    let obj, callback1, callback2, callback3, callback4;

    const prepareFn = (number) => (...args) => {
        check[number] = args;
    };

    before(() => {
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
        before(async () => {
            reset();
            await Promise.all([
                obj.trigger('test1', 2),
                obj.trigger('test2', 'callback'),
                obj.trigger('test3', 1, 4, 2),
            ]);
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
        it('should remove a callback', async () => {
            reset();
            obj.off('test3', callback3);
            Promise.all([
                obj.trigger('test3', 1, 4, 2),
            ]);
            assert.equal(check['3'], false);
            assert.deepEqual(check['4'], [1, 4, 2]);
        });

        it('should remove an event', async () => {
            reset();
            obj.off('test2');
            await Promise.all([
                obj.trigger('test2', 'callback'),
            ]);
            assert.equal(check['2'], false);
        });

        it('should remove all events', async () => {
            reset();
            obj.destroy();
            await Promise.all([
                obj.trigger('test1', 2),
                obj.trigger('test3', 1, 4, 2),
            ]);
            assert.equal(check['1'], false);
            // assert.equal(check['4'], false);
        });
    });



    describe('not function callback', () => {
        it('should throws', () => {
            assert.throws(() => obj.on('event', 4), TypeError);
        });
    });
});
