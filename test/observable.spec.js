/* eslint-env mocha */
import { Observable } from '../src/observable.js';

describe('Unit: Observable', () => {
    let obj = new Observable();

    let check = {
        1: false,
        2: false,
        3: false,
        4: false,
    };

    function prepareFn(number) {
        return (...args) => {
            check[number] = args;
        };
    }

    let callback1 = prepareFn(1);
    let callback2 = prepareFn(2);
    let callback3 = prepareFn(3);
    let callback4 = prepareFn(4);

    describe('add listeners', () => {
        before((done) => {
            obj.on('test1', callback1);
            obj.on('test2', callback2);
            obj.on('test3', callback3);
            obj.on('test3', callback4);
            Promise.all([
                obj.trigger('test1', 2),
                obj.trigger('test2', 'callback'),
                obj.trigger('test3', 1, 4, 2),
            ]).then(() => {
                done();
            });
        });

        after(() => {
            check = {
                1: false,
                2: false,
                3: false,
                4: false,
            };
        });

        it('simple callback', () => {
            assert.equal(check['1'][0], 2);
        });

        it('callback with one argument', () => {
            assert.equal(check['2'][0], 'callback');
        });

        it('multiple callbacks with more arguments', () => {
            assert.equal(check['3'][0] + check['3'][1] + check['3'][2], 7);
            assert.equal(check['4'][0] + check['4'][1] + check['4'][2], 7);
        });
    });

    describe('remove listeners', () => {
        before((done) => {
            obj.off('test1');
            obj.off('test2');
            obj.off('test3', callback3);
            Promise.all([
                obj.trigger('test1', 2),
                obj.trigger('test2', 'callback'),
                obj.trigger('test3', 1, 4, 2),
            ]).then(() => {
                done();
            });
        });

        it('simple callback', () => {
            assert.equal(check['1'], false);
        });

        it('callback with one argument', () => {
            assert.equal(check['2'], false);
        });

        it('callback with more arguments', () => {
            assert.equal(check['3'], false);
            assert.equal(check['4'][0] + check['4'][1] + check['4'][2], 7);
        });
    });
});
