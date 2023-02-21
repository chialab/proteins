import { assert } from '@chialab/ginsenghino';
import { merge, isUndefined, isDate } from '@chialab/proteins';

function getDescriptors(obj) {
    return Object.getOwnPropertyNames(obj)
        .reduce((acc, propName) => {
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

    it('should merge two objects', () => {
        const hybrid = merge(obj1, obj2);
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
        });
        const merged = merge(test, test2);
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
        const hybrid = merge.config({ strictMerge: true })(obj1, obj2);
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

    it('should merge two objects (joinArrays)', () => {
        const hybrid = merge.config({ joinArrays: true })(obj1, obj2);
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

    const array1 = [
        'value_1_1',
        'value_1_2',
    ];
    const array2 = [
        'value_2_1',
        'value_2_2',
    ];

    before(() => {
        array2.customProp = 'customProp_value';
        Object.defineProperty(array2, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
        });
        array2.customProp3 = { test: 1 };
    });

    it('should merge two arrays with custom properties', () => {
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
        assert.deepEqual(actual, expected);
        assert.ownInclude(actualProperties, 'customProp');
        assert.ownInclude(actualProperties, 'customProp2');
        assert.ownInclude(actualProperties, 'customProp3');
        assert.notEqual(array2.customProp3, actual.customProp3);
        assert.equal(actual.customProp3.test, 1);
    });

    it('should merge two arrays with custom properties (joinArrays)', () => {
        const actual = merge.config({ joinArrays: true })(array1, array2);
        const expected = [...array1, ...array2];
        expected['customProp'] = 'customProp_value';
        Object.defineProperty(expected, 'customProp2', {
            get() {
                return 'customProp2_value';
            },
        });

        assert.deepEqual(actual, expected);
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp');
        assert.ownInclude(Object.getOwnPropertyNames(actual), 'customProp2');
        assert.equal(actual['customProp2'], expected['customProp2']);
    });

    it('should skip different property names (strictMerge)', () => {
        const obj = {
            prop1: 1,
            prop2: 2,
        };
        const obj2 = {
            prop2: 7,
            prop3: 3,
        };

        const merged = merge.config({ strictMerge: true })(obj, obj2);
        assert.deepEqual(merged, {
            prop1: 1,
            prop2: 7,
        });
    });

    it('should skip properties when different descriptor structure (strictMerge)', () => {
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

        assert.equal(merged.prop1, 7);
        assert.include(Object.keys(descriptors['prop2']), 'get');
        assert.include(Object.keys(descriptors['prop2']), 'set');
        assert.equal(merged.prop2, 2);
    });

    it('should throw with incompatible types', () => {
        assert.throws(() => merge({}, 2), 'incompatible types');
    });
});
