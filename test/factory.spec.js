/* eslint-env mocha */
import { trigger } from '../src/events.js';
import { Factory, Observable } from '../src/factory.js';
import { getContext } from '../src/context.js';

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
                obj.destroy();
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

class InjectedFactory extends Factory {
    get prop() {
        return '__TEST__';
    }

    test() {
        return this.prop;
    }
}

class Injected2Factory extends Factory {
    test() {
        return 11;
    }
}

class Injected3Factory extends Factory {
    get inject() {
        return [Injected2Factory.SYM];
    }

    test() {
        return 2;
    }
}

class Injected4Factory extends Factory {
    get inject() {
        return [Injected3Factory.SYM];
    }

    test() {
        return this[Injected3Factory.SYM].test();
    }
}

class MainFactory extends Factory {
    get inject() {
        return [InjectedFactory.SYM];
    }
}

class ChildFactory extends Factory {
    get inject() {
        return [InjectedFactory.SYM, Injected2Factory.SYM, Injected4Factory.SYM];
    }

    get defaultConfig() {
        return {
            mode: 1,
            dispatch: false,
            filters: ['firstName'],
        };
    }

    constructor(...args) {
        super(...args);
        this.prop = 11;
    }
}

describe('Unit: Factory', () => {
    let factory = new MainFactory();
    let child = factory.init(ChildFactory, {
        mode: 2,
        filters: ['lastName'],
    });

    it('should instantiate a factory', () => {
        assert(factory instanceof MainFactory);
        assert.equal(getContext(factory), undefined);
    });

    it('should instantiate a factory in the same context', () => {
        assert(child instanceof ChildFactory);
        assert.equal(child[InjectedFactory.SYM], factory[InjectedFactory.SYM]);
        assert.equal(child.prop, 11);
        assert.equal(getContext(child), factory);
    });

    it('should instantiate sub factories', () => {
        assert(child[Injected4Factory.SYM] instanceof Factory);
        assert.equal(child[Injected4Factory.SYM].test(), 2);
        assert.equal(child[Injected4Factory.SYM][Injected3Factory.SYM][Injected2Factory.SYM], child[Injected2Factory.SYM]);
    });

    it('should instantiate a factory with configuration', () => {
        assert.deepEqual(child.config(), {
            mode: 2,
            dispatch: false,
            filters: ['lastName'],
        });
        assert.equal(child.configChanged, undefined);
        child.config('mode', 4);
        assert.deepEqual(child.config(), {
            mode: 4,
            dispatch: false,
            filters: ['lastName'],
        });
    });

    it('should handle injected', () => {
        assert(child[InjectedFactory.SYM] instanceof InjectedFactory);
        assert(child[Injected2Factory.SYM] instanceof Injected2Factory);
        assert.equal(child[InjectedFactory.SYM].test(), '__TEST__');
        assert.equal(child[Injected2Factory.SYM].test(), 11);
    });

    it('should destroy a factory in the same context', () => {
        child.destroy();
        assert(child instanceof ChildFactory);
        assert(!getContext(child));
    });

    describe('listener', () => {
        let scope = {
            key: 1,
        };
        let check1 = 0;
        let callback1 = function() {
            check1 += this.key;
        };
        let check2 = 0;
        let callback2 = function() {
            check2 += this.key;
        };

        before((done) => {
            Promise.all([
                factory.listen(scope, 'event', callback1),
                factory.listen(scope, 'event2', callback2),
                trigger(scope, 'event'),
                trigger(scope, 'event2'),
                factory.unlisten(scope, 'event2', callback2),
                trigger(scope, 'event'),
                trigger(scope, 'event2'),
                factory.unlisten(),
                // trigger(scope, 'event'),
                // trigger(scope, 'event2'),
            ]).then(() => {
                done();
            });
        });

        it('should listen to object event manager', () => {
            assert.equal(check1, 2);
            assert.equal(check2, 1);
        });
    });
});
