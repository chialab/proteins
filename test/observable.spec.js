/* eslint-env mocha */
import { Observable } from '../src/observable.js';

describe('Unit: Observable', () => {
    let obj = new Observable();
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

    obj.on('test1', callback1);
    obj.on('test2', callback2);
    obj.on('test3', callback3);
    obj.on('test3', callback4);

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
                        obj.trigger('test1', 2),
                        obj.trigger('test2', 'callback'),
                        obj.trigger('test3', 1, 4, 2),
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
                obj.off('test3', callback3);
                Promise.all([
                    obj.trigger('test3', 1, 4, 2),
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
                obj.off('test2');
                Promise.all([
                    obj.trigger('test2', 'callback'),
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
                obj.off();
                Promise.all([
                    obj.trigger('test1', 2),
                    obj.trigger('test3', 1, 4, 2),
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
            assert.throws(() => obj.on('event', 4), TypeError);
        });
    });
});
