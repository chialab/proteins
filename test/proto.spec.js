import { Proto } from '@chialab/proteins';
import { assert, beforeAll, describe, expect, test } from 'vitest';

describe('Unit: Proto', () => {
    let A, B, C, D;

    beforeAll(() => {
        A = class A {
            get prop() {
                return null;
            }

            test() {}
        };

        B = class B extends A {
            test() {}

            test2() {}
        };

        C = class C extends B {
            constructor() {
                super();
                this.id = 1;
            }

            get prop() {
                return null;
            }

            get prop2() {
                return null;
            }
        };

        D = class D extends C {
            test3() {}

            test4() {}

            get prop() {
                return null;
            }

            get prop3() {
                return null;
            }

            get prop4() {
                return null;
            }
        };
    });

    test('should recognize prototype keys', () => {
        const res = Object.keys(Proto.entries(D)).sort();
        expect(res).toHaveLength(9);
        expect(res).toEqual(['constructor', 'prop', 'prop2', 'prop3', 'prop4', 'test', 'test2', 'test3', 'test4']);
    });

    test('should recognize prototype methods', () => {
        const res = Object.keys(Proto.methods(D)).sort();
        expect(res).toHaveLength(4);
        expect(res).toEqual(['test', 'test2', 'test3', 'test4']);
    });

    test('should recognize prototype properties', () => {
        const res = Object.keys(Proto.properties(D)).sort();
        expect(res).toHaveLength(4);
        expect(res).toEqual(['prop', 'prop2', 'prop3', 'prop4']);
    });

    test('should retrieve all descriptors for a property', () => {
        expect(Proto.reduce(Object, 'prop')).toHaveLength(0);
        expect(Proto.reduce(A, 'prop')).toHaveLength(1);
        expect(Proto.reduce(B, 'prop')).toHaveLength(1);
        expect(Proto.reduce(C, 'prop')).toHaveLength(2);
        expect(Proto.reduce(D, 'prop')).toHaveLength(3);
    });

    test('should detect property existence', () => {
        assert(Proto.has(D, 'prop3'));
        assert(Proto.has(D, 'test3'));
        assert(Proto.has(D, 'constructor'));
        assert(!Proto.has(B, 'prop3'));
        assert(!Proto.has(B, 'test3'));
        assert(Proto.has(B, 'constructor'));
    });

    test('should retrieve prototype', () => {
        const a = new A();
        expect(Proto.get(a).test).toBeTypeOf('function');
        expect(Proto.get(a).prop).toBeNull();
        expect(A.prototype).toBe(Proto.get(a));
    });
});
