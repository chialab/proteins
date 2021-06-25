import { assert } from '@esm-bundle/chai/esm/chai.js';
import { trigger, Factory } from '@chialab/proteins';

class InjectedFactory extends Factory.Factory {
    get prop() {
        return '__TEST__';
    }

    test() {
        return this.prop;
    }
}

class Injected2Factory extends Factory.Factory {
    test() {
        return 11;
    }
}

class Injected3Factory extends Factory.Factory {
    get inject() {
        return [Injected2Factory.SYM];
    }

    test() {
        return 2;
    }
}

class Injected4Factory extends Factory.Factory {
    get inject() {
        return [Injected3Factory.SYM];
    }

    test() {
        return this[Injected3Factory.SYM].test();
    }
}

class MainFactory extends Factory.Factory {
    get inject() {
        return [InjectedFactory.SYM];
    }
}

class ChildFactory extends MainFactory {
    get inject() {
        return [...super.inject, Injected2Factory.SYM, Injected4Factory.SYM];
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
    let factory, child;

    before(() => {
        factory = new MainFactory();
        child = factory.init(ChildFactory, {
            mode: 2,
            filters: ['lastName'],
        });
    });

    it('should instantiate a factory', () => {
        assert(factory instanceof MainFactory);
        assert.equal(factory[Factory.CONTEXT_SYM], factory);
    });

    it('should instantiate a factory in the same context', () => {
        assert(child instanceof ChildFactory);
        assert.equal(child[InjectedFactory.SYM], factory[InjectedFactory.SYM]);
        assert.equal(child.prop, 11);
        assert.equal(child[Factory.CONTEXT_SYM], factory);
    });

    it('should instantiate sub factories', () => {
        assert(child[Injected4Factory.SYM] instanceof Factory.Factory);
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
        assert(!child[Factory.CONTEXT_SYM]);
    });

    describe('listener', () => {
        it('should listen to object event manager', async () => {
            const scope = {
                key: 1,
            };
            let check1 = 0;
            function callback1() {
                check1 += this.key;
            }
            let check2 = 0;
            function callback2() {
                check2 += this.key;
            }

            await Promise.all([
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
            ]);
            assert.equal(check1, 2);
            assert.equal(check2, 1);
        });
    });
});
