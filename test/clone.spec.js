/* eslint-env mocha */
import clone from '../src/clone.js';
import { isDate, isNumber, isString, isObject, isArray, isUndefined } from '../src/types.js';

describe('Unit: Clone', () => {
    it('should clone a date', () => {
        let original = new Date();
        original.test = true;
        let cloned = clone(original);
        assert(isDate(cloned));
        assert(cloned.getTime() === original.getTime());
        assert(original.test);
        assert(isUndefined(cloned.test));
    });

    it('should clone a number', () => {
        let original = 2;
        let cloned = clone(original);
        assert(isNumber(cloned));
        assert.equal(cloned, original);
    });

    it('should clone a string', () => {
        let original = 'hello';
        let cloned = clone(original);
        assert(isString(cloned));
        assert.equal(cloned, original);
    });

    it('should clone an object', () => {
        let original = {
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
        let cloned = clone(original);
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
        let original = [1, 2, 3];
        let cloned = clone(original, (arr, index, val) => {
            if (index === 1) {
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
});
