import { Factory, trigger } from '@chialab/proteins';
import { beforeAll, describe, expect, test } from 'vitest';

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

    beforeAll(() => {
        factory = new MainFactory();
        child = factory.init(ChildFactory, {
            mode: 2,
            filters: ['lastName'],
        });
    });

    test('should instantiate a factory', () => {
        expect(factory).toBeInstanceOf(MainFactory);
        expect(factory[Factory.CONTEXT_SYM]).toBe(factory);
    });

    test('should instantiate a factory in the same context', () => {
        expect(child).toBeInstanceOf(ChildFactory);
        expect(child[InjectedFactory.SYM]).toBe(factory[InjectedFactory.SYM]);
        expect(child[Factory.CONTEXT_SYM]).toBe(factory);
        expect(child.prop).toBe(11);
    });

    test('should instantiate sub factories', () => {
        expect(child[Injected4Factory.SYM]).toBeInstanceOf(Factory.Factory);
        expect(child[Injected4Factory.SYM].test()).toBe(2);
        expect(child[Injected4Factory.SYM][Injected3Factory.SYM][Injected2Factory.SYM]).toBe(
            child[Injected2Factory.SYM]
        );
    });

    test('should instantiate a factory with configuration', () => {
        expect(child.config()).toEqual({
            mode: 2,
            dispatch: false,
            filters: ['lastName'],
        });
        expect(child.configChanged).toBeUndefined();
        child.config('mode', 4);
        expect(child.config()).toEqual({
            mode: 4,
            dispatch: false,
            filters: ['lastName'],
        });
    });

    test('should handle injected', () => {
        expect(child[InjectedFactory.SYM]).toBeInstanceOf(InjectedFactory);
        expect(child[Injected2Factory.SYM]).toBeInstanceOf(Injected2Factory);
        expect(child[InjectedFactory.SYM].test()).toBe('__TEST__');
        expect(child[Injected2Factory.SYM].test()).toBe(11);
    });

    test('should destroy a factory in the same context', () => {
        child.destroy();
        expect(child).toBeInstanceOf(ChildFactory);
        expect(child[Factory.CONTEXT_SYM]).toBeUndefined();
    });

    describe('listener', () => {
        test('should listen to object event manager', async () => {
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
            expect(check1).toBe(2);
            expect(check2).toBe(1);
        });
    });
});
