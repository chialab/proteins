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
    let descriptors;
    objects.forEach((obj2) => {
        // Use descriptors to include custom properties, getters and setters.
        descriptors = Object.getOwnPropertyDescriptors(obj2);

        if (isObject(res) && isObject(obj2)) {
            Object.keys(descriptors).forEach((key) => {
                if (!options.strictMerge || !!Object.getOwnPropertyDescriptor(first, key)) {
                    let rightDescriptor = descriptors[key];
                    let rightVal = clone(rightDescriptor.value);
                    let leftDescriptor = Object.getOwnPropertyDescriptor(res, key);
                    let leftVal = leftDescriptor.value;

                    if (rightVal && isObject(rightVal) && leftVal && isObject(leftVal) && options.mergeObjects) {
                        res[key] = merge.call(this, leftVal, rightVal);
                    } else if (isArray(rightVal) && isArray(leftVal) && options.joinArrays) {
                        res[key] = merge.call(this, res[key], rightDescriptor);
                    } else {
                        res[key] = clone(obj2[key]);
                    }
                }
            });
        } else if (isArray(first) && isArray(obj2)) {
            // Skip length descriptor.
            delete descriptors.length;

            Object.keys(descriptors).forEach((key) => {
                if (options.joinArrays &&
                    // If property has a value
                    descriptors[key].hasOwnProperty('value') &&
                    // and key is a number
                    !isNaN(key) &&
                    // and `first` already own a property with this key
                    !!Object.getOwnPropertyDescriptor(first, key)
                ) {
                    // append the value instead of overwriting.
                    res[res.length] = clone(descriptors[key].value);
                } else {
                    Object.defineProperty(res, key, descriptors[key]);
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
