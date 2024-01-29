import { merge } from '@chialab/proteins';
import { beforeAll, describe, expect, test } from 'vitest';

function getDescriptors(obj) {
    return Object.getOwnPropertyNames(obj).reduce((acc, propName) => {
        acc[propName] = Object.getOwnPropertyDescriptor(obj, propName);
        return acc;
    }, {});
}

describe('Unit: Merge', () => {
    const obj1 = {
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
        awards: {
            smith: new Date('1936/01/01'),
            special: new Date('2017/01/01'),
        },
    };

    const obj2 = {
        lastName: 'Rickman',
        birthday: new Date('1946/02/21'),
        enemies: [
            {
                name: 'oscar',
            },
        ],
        wife: {
            firstName: 'Rima',
            lastName: 'Horton',
        },
        awards: {
            golden_globe: new Date('1997/01/01'),
            special: new Date('2017/01/02'),
        },
    };

    const array1 = ['value_1_1', 'value_1_2'];
    const array2 = ['value_2_1', 'value_2_2'];

    beforeAll(() => {
        array2.customProp = 'customProp_value';
        Object.defineProperty(array2, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
        });
        array2.customProp3 = { test: 1 };
    });

    test('should merge two objects', () => {
        const hybrid = merge(obj1, obj2);
        expect(hybrid.firstName).toBe('Alan');
        expect(hybrid.lastName).toBe('Rickman');
        expect(hybrid.birthday.getTime()).toBe(new Date('1946/02/21').getTime());
        expect(hybrid.enemies.length).toBe(1);
        expect(hybrid.enemies[0].name).toBe('oscar');
        expect(hybrid.wife.firstName).toBe('Rima');
        expect(hybrid.awards.golden_globe).instanceOf(Date);
        expect(hybrid.awards.smith).instanceOf(Date);
        expect(hybrid.awards.special.getTime()).toBe(new Date('2017/01/02').getTime());
    });

    test('should merge two objects with getter/setter', () => {
        const test = {
            prop1: 1,
            prop2: {
                array_prop: [1, 2, 3],
            },
        };
        const test2 = {
            prop2: {
                array_prop: [4, 5],
                array_prop2: [6, 7],
            },
            prop3: 3,
        };
        Object.defineProperty(test2, 'customProp', {
            get() {
                return 'customProp_value';
            },
        });
        const merged = merge(test, test2);
        expect(merged.prop1).toBe(1);
        expect(merged['prop2']).toEqual({
            array_prop: [4, 5],
            array_prop2: [6, 7],
        });
        expect(merged['prop3']).toBe(3);
        expect(Object.getOwnPropertyNames(merged)).toContain('customProp');
        expect(merged['customProp']).toBe('customProp_value');
    });

    test('should merge two objects in strict mode', () => {
        const hybrid = merge.config({ strictMerge: true })(obj1, obj2);
        expect(hybrid.firstName).toBe('Alan');
        expect(hybrid.lastName).toBe('Rickman');
        expect(hybrid.birthday.getTime()).toBe(new Date('1946/02/21').getTime());
        expect(hybrid.enemies.length).toBe(1);
        expect(hybrid.enemies[0].name).toBe('oscar');
        expect(hybrid.wife).toBeUndefined();
        expect(hybrid.awards.smith).toBeInstanceOf(Date);
        expect(hybrid.awards.golden_globe).toBeUndefined();
        expect(hybrid.awards.special.getTime()).toBe(new Date('2017/01/02').getTime());
    });

    test('should merge two objects (joinArrays)', () => {
        const hybrid = merge.config({ joinArrays: true })(obj1, obj2);
        expect(hybrid.firstName).toBe('Alan');
        expect(hybrid.lastName).toBe('Rickman');
        expect(hybrid.birthday.getTime()).toBe(new Date('1946/02/21').getTime());
        expect(hybrid.enemies.length).toBe(2);
        expect(hybrid.enemies[0].name).toBe('enigma');
        expect(hybrid.enemies[1].name).toBe('oscar');
        expect(hybrid.wife.firstName).toBe('Rima');
        expect(hybrid.awards.golden_globe).toBeInstanceOf(Date);
        expect(hybrid.awards.smith).toBeInstanceOf(Date);
        expect(hybrid.awards.special.getTime()).toBe(new Date('2017/01/02').getTime());
    });

    test('should merge two arrays with custom properties', () => {
        // Values of array1 will be overwritten by those of array2 because their keys match.
        const expected = [...array2];
        expected.customProp = 'customProp_value';
        Object.defineProperty(expected, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
        });
        expected.customProp3 = { test: 1 };
        const actual = merge(array1, array2);
        const actualProperties = Object.getOwnPropertyNames(actual);
        expect(actual).toEqual(expected);
        expect(actualProperties).toContain('customProp');
        expect(actualProperties).toContain('customProp2');
        expect(actualProperties).toContain('customProp3');
        expect(array2.customProp3).not.toBe(actual.customProp3);
        expect(actual.customProp3.test).toBe(1);
    });

    test('should merge two arrays with custom properties (joinArrays)', () => {
        const actual = merge.config({ joinArrays: true })(array1, array2);
        expect(actual[0]).toEqual('value_1_1');
        expect(actual[1]).toEqual('value_1_2');
        expect(actual[2]).toEqual('value_2_1');
        expect(actual[3]).toEqual('value_2_2');
        expect(actual.customProp).toBe('customProp_value');
        expect(actual.customProp2).toBe('customProp2_value');
        expect(actual.customProp3).toEqual({ test: 1 });
        expect(Object.getOwnPropertyNames(actual)).toContain('customProp');
        expect(Object.getOwnPropertyNames(actual)).toContain('customProp2');
    });

    test('should skip different property names (strictMerge)', () => {
        const obj = {
            prop1: 1,
            prop2: 2,
        };
        const obj2 = {
            prop2: 7,
            prop3: 3,
        };

        const merged = merge.config({ strictMerge: true })(obj, obj2);
        expect(merged).toEqual({
            prop1: 1,
            prop2: 7,
        });
    });

    test('should skip properties when different descriptor structure (strictMerge)', () => {
        const obj = {
            prop1: 1,
        };
        const descriptor = {
            get() {
                return 2;
            },
            set(value) {
                return value;
            },
        };
        Object.defineProperty(obj, 'prop2', descriptor);

        const obj2 = {
            prop1: 7,
            prop2: 5,
        };

        const merged = merge.config({ strictMerge: true })(obj, obj2);
        const descriptors = getDescriptors(merged);

        expect(merged.prop1).toBe(7);
        expect(Object.keys(descriptors['prop2'])).toContain('get');
        expect(Object.keys(descriptors['prop2'])).toContain('set');
        expect(merged.prop2).toBe(2);
    });

    test('should throw with incompatible types', () => {
        expect(() => merge({}, 2)).toThrow('incompatible types');
    });
});
