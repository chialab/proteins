/* eslint-env mocha */
import Symbolic from '../src/symbolic.js';

describe('Unit: Symbolic', () => {
    it('should set a symbolic property', () => {
        const AGE = Symbolic('age');
        let user = {
            firstName: 'Alan',
            lastName: 'Turing',
        };

        user[AGE] = 29;

        let enumKeys = [];
        for (let k in user) {
            enumKeys.push(k);
        }

        assert.equal(user.firstName, 'Alan');
        assert.equal(user.lastName, 'Turing');
        assert.equal(user[AGE], 29);
        assert.equal(Object.keys(user).length, 2);
        assert.equal(enumKeys.length, 2);
        assert(!Object.hasOwnProperty('age'));
    });
});
