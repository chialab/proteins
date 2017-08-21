/* eslint-env mocha */
import Symbolic from '../src/symbolic.js';

describe('Unit: Symbolic', () => {
    it('should set a symbolic property', () => {
        const AGE = new Symbolic('age');
        let user = {
            firstName: 'Alan',
            lastName: 'Turing',
        };
        AGE.set(user, 29);

        let enumKeys = [];
        for (let k in user) {
            enumKeys.push(k);
        }

        assert.equal(user.firstName, 'Alan');
        assert.equal(user.lastName, 'Turing');
        assert.equal(AGE.get(user), 29);
        assert.equal(Object.keys(user).length, 2);
        assert.equal(enumKeys.length, 2);
        assert(AGE.has(user));
        assert(!AGE.has({}));
        assert(!Object.hasOwnProperty('age'));
    });
});
