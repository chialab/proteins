import { clone, Observable } from '@chialab/proteins';
import { describe, expect, test } from 'vitest';

describe('Unit: Clone', () => {
    test('should clone a date', () => {
        const original = new Date();
        original.test = true;
        const cloned = clone(original);
        expect(cloned).toBeInstanceOf(Date);
        expect(cloned.getTime()).toBe(original.getTime());
        expect(original.test).toBe(true);
        expect(cloned.test).toBeUndefined();
    });

    test('should clone a number', () => {
        const original = 2;
        const cloned = clone(original);
        expect(cloned).toBeTypeOf('number');
        expect(cloned).toBe(original);
    });

    test('should clone a string', () => {
        const original = 'hello';
        const cloned = clone(original);
        expect(cloned).toBeTypeOf('string');
        expect(cloned).toBe(original);
    });

    test('should clone an object', () => {
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
        expect(cloned).toBeTypeOf('object');
        expect(cloned.firstName).toBe('Alan');
        expect(cloned.lastName).toBe('Turing');
        expect(cloned.birthday).toBeInstanceOf(Date);
        expect(cloned.birthday.getTime()).toBe(new Date('1912/06/23').getTime());
        expect(cloned.enemies).toBeInstanceOf(Array);
        expect(cloned.enemies.length).toBe(1);
        expect(cloned.enemies[0].name).toBe('enigma');
        expect(cloned.enemies[0].attack).toBe(8);
        expect(cloned.enemies[0].defense).toBe(9);
        expect(JSON.stringify(original)).toBe(JSON.stringify(cloned));
        cloned.enemies.pop();
        expect(original.enemies.length).toBe(1);
        expect(cloned.enemies.length).toBe(0);
    });

    test('should clone an object with custom callback', () => {
        const original = [1, 2, 3];
        const cloned = clone(original, (arr, index, val) => {
            if (index == 1) {
                return 2 * val;
            }
            return val;
        });
        expect(cloned).toBeInstanceOf(Array);
        expect(cloned.length).toBe(3);
        expect(cloned[0]).toBe(1);
        expect(cloned[1]).toBe(4);
        expect(cloned[2]).toBe(3);
    });

    test('should clone a class', () => {
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
        expect(cloned).toBeInstanceOf(B);
        expect(cloned).toBeInstanceOf(A);
        expect(cloned).not.toBe(b);
        expect(cloned.test).toBe(11);
        expect(cloned.test3).toBe(3);
        expect(cloned.test2).toBeInstanceOf(A);
        expect(cloned.test2).not.toBe(b.test2);
        expect(cloned.test2.test3).toBe(3);
    });

    test('should clone circular dependencies', () => {
        const a = {
            test: 2,
        };
        const b = {
            test: 11,
            value: a,
        };
        a.value = b;
        const cloned = clone(b);
        expect(cloned.test).toBe(11);
        expect(cloned.value).not.toBe(a);
        expect(cloned.value.test).toBe(2);
        expect(cloned.value.value).not.toBe(b);
        expect(cloned.value.value).toBe(cloned);
    });

    test('should not clone functions', () => {
        const TEST_FUN = () => {};
        expect(clone(TEST_FUN)).toBe(TEST_FUN);
        expect(clone(TEST_FUN)).not.toBe(TEST_FUN.bind(null));
    });

    test('should clone properties with getter/setter', () => {
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
        expect(cloned.test).toBe(2);
        expect(cloned.test2).toBe(2);

        cloned.test2 = 3;
        expect(cloned.test).toBe(6);
    });

    test('should clone arrays with custom properties', () => {
        const a = [1, 2];
        Object.defineProperty(a, 'test', { value: 3 });
        const cloned = clone(a);
        expect(cloned.test).toBe(3);
    });

    test('should unfreeze clones of frozen objects', () => {
        const a = { test: 1 };
        Object.freeze(a);
        const cloned = clone(a);
        cloned.test = 2;
        expect(Object.isFrozen(cloned)).toBe(false);
        expect(cloned.test).toBe(2);
        // test does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.test = 2;
        // }, TypeError);
    });

    test('should freeze clones of frozen objects with strict mode', () => {
        const a = { test: 1 };
        Object.freeze(a);
        const cloned = clone(a, true);
        expect(Object.isFrozen(cloned)).toBe(true);
        expect(cloned.test).toBe(1);
        // test does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.test = 2;
        // }, TypeError);
    });

    test('should unseal clones of sealed objects', () => {
        const a = { test: 1 };
        Object.seal(a);
        const cloned = clone(a);
        cloned.missing = true;
        expect(Object.isSealed(cloned)).toBe(false);
        expect(cloned.missing).toBe(true);
        // test does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.missing = 2;
        // }, TypeError);
    });

    test('should seal clones of sealed objects with strict mode', () => {
        const a = { test: 1 };
        Object.seal(a);
        const cloned = clone(a, true);
        expect(Object.isSealed(cloned)).toBe(true);
        // test does not works
        // assert.throws(() => {
        //     'use strict';
        //     cloned.missing = 2;
        // }, TypeError);
    });

    test('should clone Observable arrays', () => {
        const a = new Observable([1, 2]);
        const cloned = clone(a);
        expect(cloned).toBeInstanceOf(Array);
        expect(cloned).toEqual([1, 2]);
    });
});
