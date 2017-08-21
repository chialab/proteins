/* eslint-env mocha */
import { trigger } from '../src/events.js';
import { Factory, Observable, CONTEXT_SYM } from '../src/factory.js';

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

    initialize(conf) {
        return super.initialize(conf)
            .then(() => {
                this.conf = conf;
                return Promise.resolve(this);
            });
    }
}

class MainFactory extends Factory {
    static get injectors() {
        return {
            test: InjectedFactory,
        };
    }
}

class ChildFactory extends Factory {
    static get injectors() {
        return {
            test: Injected2Factory,
            test2: [Injected2Factory, '__TEST__'],
        };
    }

    get defaultConfig() {
        return {
            mode: 1,
            dispatch: false,
            filters: ['firstName'],
        };
    }

    initialize(...args) {
        return super.initialize(...args)
            .then(() => {
                this.prop = 11;
                return Promise.resolve(this);
            });
    }
}

describe('Unit: Factory', () => {
    let factory;
    let child;

    before((done) => {
        MainFactory.init()
            .then((object) => {
                factory = object;
                return factory.init(ChildFactory, {
                    mode: 2,
                    filters: ['lastName'],
                })
                    .then((object) => {
                        child = object;
                        done();
                    });
            })
            .catch(() => {
                done();
            });
    });

    it('should instantiate a factory', () => {
        assert(factory instanceof MainFactory);
        assert.equal(CONTEXT_SYM.get(factory), factory);
    });

    it('should instantiate a factory in the same context', () => {
        assert(child instanceof ChildFactory);
        assert.equal(child.prop, 11);
        assert.equal(CONTEXT_SYM.get(child), factory);
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
        assert(child.factory('test') instanceof InjectedFactory);
        assert(child.factory('test2') instanceof Injected2Factory);
        assert.equal(child.factory('test').test(), '__TEST__');
        assert.equal(child.factory('test2').conf, '__TEST__');
        assert.equal(child.factory('test2').test(), 11);
    });

    it('should destroy a factory in the same context', () => {
        child.destroy();
        assert(child instanceof ChildFactory);
        assert(!CONTEXT_SYM.has(child));
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
