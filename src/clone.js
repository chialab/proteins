import { isObject, isDate, isArray } from './types.js';

/**
 * Clone an object.
 *
 * @method clone
 * @param {*} obj The instance to clone.
 * @param {Function} [callback] A modifier function for each property.
 * @return {*} The clone of the object.
 *
 * @example
 * const Person = {
 *   firstName: 'Alan',
 *   lastName: 'Turing',
 *   birthday: new Date('1912/06/12'),
 *   knowledge: ['math', 'logic', 'cryptography'],
 *   enemies: [
 *       { name: 'Enigma', year: '1940' },
 *       { name: 'Homophobia', year: '1954' },
 *   ],
 * };
 * const Person2 = clone(Person);
 * Person === Person2                          // -> false
 * Person.firstName === Person2.firstName      // -> true
 * Person.birthday === Person2.birthday        // -> false
 * Person.knowledge === Person2.knowledge      // -> false
 * Person.knowledge.length === Person2.knowledge.length    // -> true
 * Person.enemies[0] === Person2.enemies[0]                // -> false
 * Person.enemies[0].name === Person2.enemies[0].name      // -> true
 */
export default function clone(obj, callback) {
    callback = callback || function(scope, key, prop) { return prop; };
    if (isArray(obj)) {
        return obj.map((entry, index) => {
            entry = callback(obj, index, entry);
            return clone(entry, callback);
        });
    } else if (isObject(obj)) {
        let res = {};
        Object.keys(obj).forEach((k) => {
            let val = callback(obj, k, obj[k]);
            res[k] = clone(val, callback);
        });
        return res;
    } else if (isDate(obj)) {
        return new Date(obj.getTime());
    }
    return obj;
}
