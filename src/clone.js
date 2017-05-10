import { isObject, isDate, isArray } from './types.js';

/**
 * Clone objects.
 *
 * @param {*} obj The instance to clone.
 * @param {Function} callback An optional function which runs before inserting a property.
 * @return {Object|Array} The clone of the object.
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
        return new Date(obj);
    }
    return obj;
}
