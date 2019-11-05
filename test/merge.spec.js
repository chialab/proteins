/* eslint-env mocha */
import merge from '../src/merge.js';
import { isUndefined, isDate } from '../src/types.js';
import chai from 'chai/chai';

const { assert } = chai;

describe('Unit: Merge', () => {
    let obj1 = {
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

    let obj2 = {
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

    it('should merge two objects', () => {
        let hybrid = merge(obj1, obj2);
        assert.equal(hybrid.firstName, 'Alan');
        assert.equal(hybrid.lastName, 'Rickman');
        assert.equal(hybrid.birthday.getTime(), new Date('1946/02/21').getTime());
        assert.equal(hybrid.enemies.length, 1);
        assert.equal(hybrid.enemies[0].name, 'oscar');
        assert.equal(hybrid.wife.firstName, 'Rima');
        assert(isDate(hybrid.awards.golden_globe));
        assert(isDate(hybrid.awards.smith));
        assert.equal(hybrid.awards.special.getTime(), new Date('2017/01/02').getTime());
    });

    it('should merge two objects with getter/setter', () => {
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
            set(value) {
                return value;
            },
        });
        let merged = merge(test, test2);
        assert.equal(merged['prop1'], 1);
        assert.deepEqual(merged['prop2'], {
            array_prop: [4, 5],
            array_prop2: [6, 7],
        });
        assert.equal(merged['prop3'], 3);
        assert.ownInclude(Object.getOwnPropertyNames(merged), 'customProp');
        assert.equal(merged['customProp'], 'customProp_value');
    });

    it('should merge two objects in strict mode', () => {
        let hybrid = merge.config({ strictMerge: true })(obj1, obj2);
        assert.equal(hybrid.firstName, 'Alan');
        assert.equal(hybrid.lastName, 'Rickman');
        assert.equal(hybrid.birthday.getTime(), new Date('1946/02/21').getTime());
        assert.equal(hybrid.enemies.length, 1);
        assert.equal(hybrid.enemies[0].name, 'oscar');
        assert(isUndefined(hybrid.wife));
        assert(isDate(hybrid.awards.smith));
        assert(isUndefined(hybrid.awards.golden_globe));
        assert.equal(hybrid.awards.special.getTime(), new Date('2017/01/02').getTime());
    });

    it('should merge two objects with array join', () => {
        let hybrid = merge.config({ joinArrays: true })(obj1, obj2);
        assert.equal(hybrid.firstName, 'Alan');
        assert.equal(hybrid.lastName, 'Rickman');
        assert.equal(hybrid.birthday.getTime(), new Date('1946/02/21').getTime());
        assert.equal(hybrid.enemies.length, 2);
        assert.equal(hybrid.enemies[0].name, 'enigma');
        assert.equal(hybrid.enemies[1].name, 'oscar');
        assert.equal(hybrid.wife.firstName, 'Rima');
        assert(isDate(hybrid.awards.golden_globe));
        assert(isDate(hybrid.awards.smith));
        assert.equal(hybrid.awards.special.getTime(), new Date('2017/01/02').getTime());
    });

    let array1 = [
        'value_1_1',
        'value_1_2',
    ];
    let array2 = [
        'value_2_1',
        'value_2_2',
    ];
    array2['customProp'] = 'customProp_value';
    Object.defineProperty(array2, 'customProp2', {
        get() {
            return 'customProp2_value';
        },
        set(value) {
            return value;
        },
    });

    it('should merge two arrays with custom properties', () => {
        // Values of array1 will be overwritten by those of array2 because their keys match.
        const expected = [...array2];
        expected['customProp'] = 'customProp_value';
        Object.defineProperty(expected, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
            set(value) {
                return value;
            },
        });
        const actual = merge(array1, array2);
        assert.deepEqual(actual, expected);
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp');
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp2');
    });

    it('should merge two arrays with custom properties (with joinArrays: true)', () => {
        const actual = merge.config({ joinArrays: true })(array1, array2);
        // Values of array1 will be overwritten by those of array2 because their keys match.
        const expected = [...array1, ...array2];
        expected['customProp'] = 'customProp_value';
        Object.defineProperty(expected, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
            set(value) {
                return value;
            },
        });

        assert.deepEqual(actual, expected);
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp');
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp2');
        assert.equal(actual['customProp2'], expected['customProp2']);
    });

    it('should throws with incompatible types', () => {
        assert.throws(() => merge({}, 2), 'incompatible types');
    });
});
