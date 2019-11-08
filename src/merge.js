import clone from './clone.js';
import { getDescriptors, buildDescriptor } from './_helpers.js';
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

                const rightVal = rightDescriptor.value;
                if (options.strictMerge) {
                    if (!leftDescriptor ||
                        (leftDescriptor.value && !rightVal) ||
                        (!leftDescriptor.value && rightVal)
                    ) {
                        return;
                    }
                }

                let merged = clone(rightVal);
                if (leftDescriptor && rightVal) {
                    const leftVal = leftDescriptor.value;
                    if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
                        merged = merge.call(this, leftVal, merged);
                    } else if (isArray(leftVal) && isArray(rightVal) && options.joinArrays) {
                        merged = merge.call(this, leftVal, merged);
                    }
                }
                Object.defineProperty(res, key, buildDescriptor(rightDescriptor, merged));
            });
        } else if (isArray(first) && isArray(obj2)) {
            const descriptors = getDescriptors(obj2);
            // Skip length descriptor.
            delete descriptors.length;
            Object.keys(descriptors).forEach((key) => {
                const rightDescriptor = descriptors[key];
                let merged;
                if (!isNaN(key) && ('value' in rightDescriptor)) {
                    const leftVal = first[key];
                    const rightVal = rightDescriptor.value;
                    merged = clone(rightVal);
                    if (options.joinArrays) {
                        // check if already in the left array
                        if (first.indexOf(rightVal) === -1) {
                            // append the value instead of overwriting
                            res.push(merged);
                        }
                        return;
                    }

                    if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
                        merged = merge.call(this, leftVal, merged);
                    } else if (isArray(leftVal) && isArray(rightVal)) {
                        merged = merge.call(this, leftVal, merged);
                    }
                }
                Object.defineProperty(res, key, buildDescriptor(rightDescriptor, merged));
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
merge.config = function(options = {}) {
    return (...args) => merge.call({
        options: merge(defaults, options),
    }, ...args);
};
