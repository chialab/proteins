import { assert } from '@esm-bundle/chai/esm/chai.js';
import { Symbolic } from '@chialab/proteins';

describe('Unit: Symbolic', () => {
    it('should set a symbolic property', () => {
        const AGE = Symbolic('age');
        const user = {
            firstName: 'Alan',
            lastName: 'Turing',
        };

        user[AGE] = 29;

        const enumKeys = [];
        for (const k in user) {
            enumKeys.push(k);
        }

        assert.equal(user.firstName, 'Alan');
        assert.equal(user.lastName, 'Turing');
        assert.equal(user[AGE], 29);
        assert.equal(Object.keys(user).length, 2);
        assert.equal(enumKeys.length, 2);
        assert(!Object.prototype.hasOwnProperty.call(Object, 'age'));
    });
});
