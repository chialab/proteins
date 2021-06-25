import { assert } from '@esm-bundle/chai/esm/chai.js';
import { Proto } from '@chialab/proteins';

describe('Unit: Proto', () => {
    let A, B, C, D;

    before(() => {
        A = class A {
            get prop() {
                return null;
            }

            test() { }
        };

        B = class B extends A {
            test() { }

            test2() { }
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
            test3() { }

            test4() { }

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

    it('should recognize prototype keys', () => {
        const res = Object.keys(Proto.entries(D)).sort();
        assert.equal(res.length, 9);
        assert.deepEqual(res, ['constructor', 'prop', 'prop2', 'prop3', 'prop4', 'test', 'test2', 'test3', 'test4']);
    });

    it('should recognize prototype methods', () => {
        const res = Object.keys(Proto.methods(D)).sort();
        assert.equal(res.length, 4);
        assert.deepEqual(res, ['test', 'test2', 'test3', 'test4']);
    });

    it('should recognize prototype properties', () => {
        const res = Object.keys(Proto.properties(D)).sort();
        assert.equal(res.length, 4);
        assert.deepEqual(res, ['prop', 'prop2', 'prop3', 'prop4']);
    });

    it('should retrieve all descriptors for a property', () => {
        assert.equal(Proto.reduce(Object, 'prop').length, 0);
        assert.equal(Proto.reduce(A, 'prop').length, 1);
        assert.equal(Proto.reduce(B, 'prop').length, 1);
        assert.equal(Proto.reduce(C, 'prop').length, 2);
        assert.equal(Proto.reduce(D, 'prop').length, 3);
    });

    it('should detect property existence', () => {
        assert(Proto.has(D, 'prop3'));
        assert(Proto.has(D, 'test3'));
        assert(Proto.has(D, 'constructor'));
        assert(!Proto.has(B, 'prop3'));
        assert(!Proto.has(B, 'test3'));
        assert(Proto.has(B, 'constructor'));
    });

    it('should retrieve prototype', () => {
        const a = new A();
        assert(typeof Proto.get(a).test === 'function');
        assert(Proto.get(a).prop === null);
        assert(A.prototype === Proto.get(a));
    });
});
