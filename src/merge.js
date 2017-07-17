import clone from './clone.js';
import { isObject, isArray } from './types.js';

class MergeOptions {
    constructor(opts = {}) {
        this.mergeObjects = opts.mergeObjects || true;
        this.joinArrays = opts.joinArrays || false;
        this.strictMerge = opts.strictMerge || false;
    }
}

/**
 * Merge two objects into a new one.
 *
 * @method merge
 * @param {Object|Array} obj1 The initial object.
 * @param {Object|Array} obj2 The object to merge.
 * @param {MergeOptions} options Merge options.
 * @return {Object} The merged object.
 */
export default function merge(obj1, obj2, options) {
    if (!(options instanceof MergeOptions)) {
        options = new MergeOptions(options);
    }
    let res = clone(obj1);
    if (isObject(res) && isObject(obj2)) {
        Object.keys(obj2).forEach((key) => {
            if (!options.strictMerge || obj1.hasOwnProperty(key)) {
                let entry = obj2[key];
                if (isObject(entry) && isObject(res[key]) && options.mergeObjects) {
                    res[key] = merge(res[key], entry, options);
                } else if (isArray(entry) && isArray(res[key]) && options.joinArrays) {
                    res[key] = merge(res[key], entry, options);
                } else {
                    res[key] = clone(obj2[key]);
                }
            }
        });
    } else if (isArray(obj1) && isArray(obj2)) {
        obj2.forEach((val) => {
            if (obj1.indexOf(val) === -1) {
                res.push(clone(val));
            }
        });
    } else {
        throw 'incompatible types';
    }
    return res;
}
