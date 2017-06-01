/* eslint-env mocha */
import { Factory } from '../src/factory.js';

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
                factory.init(ChildFactory)
                    .then((object) => {
                        child = object;
                        done();
                    });
            });
    });

    it('should instantiate a factory', () => {
        assert(factory instanceof MainFactory);
        assert.equal(factory.getContext(), factory);
    });

    it('should instantiate a factory in the same context', () => {
        assert(child instanceof ChildFactory);
        assert.equal(child.prop, 11);
        assert.equal(child.getContext(), factory);
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
        assert(child.isDestroyed());
        assert.equal(child.getContext(), child);
    });
});
