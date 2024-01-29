import { buildDescriptor, getDescriptors } from './_helpers.js';
import clone from './clone.js';
import { isArray, isObject } from './types.js';

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
    const first = objects.shift();
    const res = clone(first);

    objects.forEach((obj2) => {
        if (isObject(first) && isObject(obj2)) {
            const descriptors = getDescriptors(obj2);
            Object.keys(descriptors).forEach((key) => {
                const leftDescriptor = Object.getOwnPropertyDescriptor(first, key);
                const rightDescriptor = descriptors[key];
                if (!('value' in rightDescriptor)) {
                    Object.defineProperty(res, key, buildDescriptor(rightDescriptor));
                    return;
                }

                if (options.strictMerge) {
                    if (!leftDescriptor) {
                        return;
                    }
                    if (typeof leftDescriptor.get !== typeof rightDescriptor.get) {
                        return;
                    }
                    if (typeof leftDescriptor.set !== typeof rightDescriptor.set) {
                        return;
                    }
                }

                let rightVal = clone(rightDescriptor.value);
                if (leftDescriptor && rightVal) {
                    const leftVal = leftDescriptor.value;
                    if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
                        rightVal = merge.call(this, leftVal, rightVal);
                    } else if (isArray(leftVal) && isArray(rightVal) && options.joinArrays) {
                        rightVal = merge.call(this, leftVal, rightVal);
                    }
                }
                Object.defineProperty(res, key, buildDescriptor(rightDescriptor, rightVal));
            });
        } else if (isArray(first) && isArray(obj2)) {
            const descriptors = getDescriptors(obj2);
            // Skip length descriptor.
            delete descriptors.length;
            Object.keys(descriptors).forEach((key) => {
                const rightDescriptor = descriptors[key];
                if (!('value' in rightDescriptor)) {
                    Object.defineProperty(res, key, buildDescriptor(rightDescriptor));
                    return;
                }

                const leftVal = first[key];
                let rightVal = clone(rightDescriptor.value);
                if (!isNaN(key)) {
                    if (options.joinArrays) {
                        // check if already in the left array
                        if (first.indexOf(rightVal) === -1) {
                            // append the value instead of overwriting
                            res.push(rightVal);
                        }
                        return;
                    }

                    if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
                        rightVal = merge.call(this, leftVal, rightVal);
                    } else if (isArray(leftVal) && isArray(rightVal)) {
                        rightVal = merge.call(this, leftVal, rightVal);
                    }
                }
                Object.defineProperty(res, key, buildDescriptor(rightDescriptor, rightVal));
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
 * @param {Boolean} options.mergeObjects Should ricursively merge objects keys.
 * @param {Boolean} options.joinArrays Should join arrays instead of update keys.
 * @param {Boolean} options.strictMerge Should merge only keys which already are in the first object.
 * @return {Function} The new merge function.
 */
merge.config = function (options = {}) {
    return (...args) =>
        merge.call(
            {
                options: merge(defaults, options),
            },
            ...args
        );
};
