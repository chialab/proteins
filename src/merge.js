import clone from './clone.js';
import has from './has.js';
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
    function buildDescriptor(descriptor, val) {
        let newDescriptor = {
            configurable: true,
            enumerable: descriptor.enumerable,
        };
        if (descriptor.get || descriptor.set) {
            newDescriptor['get'] = descriptor.get;
            newDescriptor['set'] = descriptor.set;
        } else {
            // `value` and `writable` are allowed in a descriptor only when there isn't a getter/setter.
            newDescriptor['value'] = val;
            newDescriptor['writable'] = descriptor.writable;
        }
        return newDescriptor;
    }
    objects.forEach((obj2) => {
        descriptors = Object.getOwnPropertyDescriptors(obj2);
        if (isObject(first) && isObject(obj2)) {
            for (const key in descriptors) {
                let leftDescriptor = Object.getOwnPropertyDescriptor(first, key);
                let rightDescriptor = descriptors[key];
                let rightVal = rightDescriptor.value;

                if (options.strictMerge) {
                    if (!leftDescriptor ||
                        (leftDescriptor.value && !rightVal) ||
                        (!leftDescriptor.value && rightVal)
                    ) {
                        continue;
                    }
                }

                let merged = rightDescriptor.value;
                if (leftDescriptor && rightVal) {
                    let leftVal = leftDescriptor.value;
                    if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
                        merged = merge.call(this, leftVal, clone(rightVal));
                    } else if (isArray(leftVal) && isArray(rightVal) && options.joinArrays) {
                        merged = merge.call(this, leftVal, clone(rightVal));
                    }
                }
                Object.defineProperty(res, key, buildDescriptor(rightDescriptor, merged));
            }
        } else if (isArray(first) && isArray(obj2)) {
            // Skip length descriptor.
            delete descriptors.length;
            for (const key in descriptors) {
                if (options.joinArrays &&
                    // If key is a number
                    !isNaN(key) &&
                    // and property has a value
                    has(descriptors[key], 'value') &&
                    // and `first` already owns a property with this key
                    Object.getOwnPropertyDescriptor(first, key)
                ) {
                    // append the value instead of overwriting.
                    Object.defineProperty(res, res.length, buildDescriptor(descriptors[key], clone(descriptors[key].value)));
                } else {
                    Object.defineProperty(res, key, buildDescriptor(descriptors[key], clone(descriptors[key].value)));
                }
            }
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
 * @param {Boolean} options.mergeObjects Should ricursively merge objects keys.
 * @param {Boolean} options.joinArrays Should join arrays instead of update keys.
 * @param {Boolean} options.strictMerge Should merge only keys which already are in the first object.
 * @return {Function} The new merge function.
 */
merge.config = function(options = {}) {
    return (...args) => merge.call({
        options: merge(defaults, options),
    }, ...args);
};
