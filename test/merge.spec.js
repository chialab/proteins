/* eslint-env mocha */
import merge from '../src/merge.js';
import { isUndefined, isDate } from '../src/types.js';

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

    it('should set merge two objects', () => {
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

    it('should set merge two objects in strict mode', () => {
        let hybrid = merge(obj1, obj2, { strictMerge: true });
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

    it('should set merge two objects with array join', () => {
        let hybrid = merge(obj1, obj2, { joinArrays: true });
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

    it('should throws with incompatible types', () => {
        assert.throws(() => merge({}, 2), 'incompatible types');
    });
});

