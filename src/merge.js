import clone from './clone.js';
import { isObject, isArray } from './types.js';

const defaults = {
    mergeObjects: true,
    joinArrays: false,
    strictMerge: false,
};

/**
 * Merge two objects into a new one.
 *
 * @method merge
 * @param {...Object|Array} objects The objects to merge.
 * @return {Object} The merged object.
 */
export default function merge(...objects) {
    let options = defaults;
    if (typeof this !== 'undefined' && this.options) {
        options = this.options;
    }
    let first = objects.shift();
    let res = clone(first);
    objects.forEach((obj2) => {
        if (isObject(res) && isObject(obj2)) {
            Object.keys(obj2).forEach((key) => {
                if (!options.strictMerge || first.hasOwnProperty(key)) {
                    let entry = obj2[key];
                    if (isObject(entry) && isObject(res[key]) && options.mergeObjects) {
                        res[key] = merge.call(this, res[key], entry);
                    } else if (isArray(entry) && isArray(res[key]) && options.joinArrays) {
                        res[key] = merge.call(this, res[key], entry);
                    }  else {
                        res[key] = clone(obj2[key]);
                    }
                }
            });
        } else if (isArray(first) && isArray(obj2)) {
            obj2.forEach((val) => {
                if (first.indexOf(val) === -1) {
                    res.push(clone(val));
                }
            });
        } else {
            throw 'incompatible types';
        }
    });
    return res;
}

/**
 * Create a new Merge function with passed options.
 *
 * @method config
 * @memberof merge
 * @param {Object} options Merge options.
 * @param {Boolean} options.mergeObjects Should merge objects keys.
 * @param {Boolean} options.joinArrays Should join arrays instead of update keys.
 * @param {Boolean} options.strictMerge Should merge only keys which already are in the first object.
 * @return {Function} The new merge function.
 */
merge.config = function(options = {}) {
    return (...args) => merge.call({
        options: merge(defaults, options),
    }, ...args);
};
