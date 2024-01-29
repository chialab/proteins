import { Symbolic } from '@chialab/proteins';
import { describe, expect, test } from 'vitest';

describe('Unit: Symbolic', () => {
    test('should set a symbolic property', () => {
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

        expect(user.firstName).toBe('Alan');
        expect(user.lastName).toBe('Turing');
        expect(user[AGE]).toBe(29);
        expect(Object.keys(user).length).toBe(2);
        expect(enumKeys.length).toBe(2);
        expect(Object.prototype.hasOwnProperty.call(Object, 'age')).toBeFalsy();
    });
});
