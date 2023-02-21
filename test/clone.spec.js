import { assert } from '@chialab/ginsenghino';
import { clone, isDate, isNumber, isString, isObject, isArray, isUndefined, Observable } from '@chialab/proteins';

describe('Unit: Clone', () => {
    it('should clone a date', () => {
        const original = new Date();
        original.test = true;
        const cloned = clone(original);
        assert(isDate(cloned));
        assert(cloned.getTime() === original.getTime());
        assert(original.test);
        assert(isUndefined(cloned.test));
    });

    it('should clone a number', () => {
        const original = 2;
        const cloned = clone(original);
        assert(isNumber(cloned));
        assert.equal(cloned, original);
    });

    it('should clone a string', () => {
        const original = 'hello';
        const cloned = clone(original);
        assert(isString(cloned));
        assert.equal(cloned, original);
    });

    it('should clone an object', () => {
        const original = {
            firstName: 'Alan',
            lastName: 'Turing',
            birthday: new Date('1912/06/23'),
            enemies: [
                {
                    name: 'enigma',
                    attack: 8,
                    defense: 9,
                },
            ],
        };
        const cloned = clone(original);
        assert(isObject(cloned));
        assert.equal(cloned.firstName, 'Alan');
        assert.equal(cloned.lastName, 'Turing');
        assert(isDate(cloned.birthday));
        assert.equal(cloned.birthday.getTime(), new Date('1912/06/23').getTime());
        assert(isArray(cloned.enemies));
        assert.equal(cloned.enemies.length, 1);
        assert.equal(cloned.enemies[0].name, 'enigma');
        assert.equal(cloned.enemies[0].attack, 8);
        assert.equal(cloned.enemies[0].defense, 9);
        assert.equal(JSON.stringify(original), JSON.stringify(cloned));
        cloned.enemies.pop();
        assert.equal(original.enemies.length, 1);
        assert.equal(cloned.enemies.length, 0);
    });

    it('should clone an object with custom callback', () => {
        const original = [1, 2, 3];
        const cloned = clone(original, (arr, index, val) => {
            if (index == 1) {
                return 2 * val;
            }
            return val;
        });
        assert(isArray(cloned));
        assert.equal(cloned.length, 3);
        assert.equal(cloned[0], 1);
        assert.equal(cloned[1], 4);
        assert.equal(cloned[2], 3);
    });

    it('should clone a class', () => {
        class A {
            constructor() {
                this.test3 = 3;
            }
        }
        class B extends A {
            constructor() {
                super();
                this.test = 11;
                this.test2 = new A();
            }
        }
        const b = new B();
        const cloned = clone(b);
        assert(cloned instanceof B);
        assert(cloned instanceof A);
        assert(cloned !== b);
        assert(cloned.test === 11);
        assert(cloned.test3 === 3);
        assert(cloned.test2 instanceof A);
        assert(cloned.test2 !== b.test2);
        assert(cloned.test2.test3 === 3);
    });

    it('should clone circular dependencies', () => {
        const a = {
            test: 2,
        };
        const b = {
            test: 11,
            value: a,
        };
        a.value = b;
        const cloned = clone(b);
        assert.equal(cloned.test, 11);
        assert(cloned.value !== a);
        assert.equal(cloned.value.test, 2);
        assert(cloned.value.value !== b);
        assert.equal(cloned.value.value, cloned);
    });

    it('should not clone functions', () => {
        const TEST_FUN = () => { };
        assert.equal(clone(TEST_FUN), TEST_FUN);
        assert(clone(TEST_FUN) !== TEST_FUN.bind(null));
    });

    it('should clone properties with getter/setter', () => {
        const a = {
            test: 2,
        };
        Object.defineProperty(a, 'test2', {
            get() {
                return this.test;
            },
            set(val) {
                this.test = this.test * val;
            },
        });
        const cloned = clone(a);
        assert.equal(cloned.test, 2);
        assert.equal(cloned.test2, 2);

        cloned.test2 = 3;
        assert.equal(cloned.test, 6);
    });

    it('should clone arrays with custom properties', () => {
        const a = [1, 2];
        Object.defineProperty(a, 'test', { value: 3 });
        const cloned = clone(a);
        assert.equal(cloned.test, 3);
    });

    it('should unfreeze clones of frozen objects', () => {
        const a = { test: 1 };
        Object.freeze(a);
        const cloned = clone(a);
        cloned.test = 2;
        assert.isNotFrozen(cloned);
        assert.equal(cloned.test, 2);
        // it does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.test = 2;
        // }, TypeError);
    });

    it('should freeze clones of frozen objects with strict mode', () => {
        const a = { test: 1 };
        Object.freeze(a);
        const cloned = clone(a, true);
        assert.isFrozen(cloned);
        assert.equal(cloned.test, 1);
        // it does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.test = 2;
        // }, TypeError);
    });

    it('should unseal clones of sealed objects', () => {
        const a = { test: 1 };
        Object.seal(a);
        const cloned = clone(a);
        cloned.missing = true;
        assert.isNotSealed(cloned);
        assert.equal(cloned.missing, true);
        // it does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.missing = 2;
        // }, TypeError);
    });

    it('should seal clones of sealed objects with strict mode', () => {
        const a = { test: 1 };
        Object.seal(a);
        const cloned = clone(a, true);
        assert.isSealed(cloned);
        // it does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.missing = 2;
        // }, TypeError);
    });

    it('should clone Observable arrays', () => {
        const a = new Observable([1, 2]);
        const cloned = clone(a);
        assert(isArray(cloned));
        assert.notStrictEqual(cloned, [1, 2]);
    });
});
