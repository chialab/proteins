import { isObject, isDate, isArray, isFunction } from './types.js';

/**
 * Recursive objects equivalence check.
 * @param {*} obj1 The original object.
 * @param {*} obj2 The object to compare
 * @param {Array} [processing] A list of already processed comparisons.
 * @return {Boolean}
 */
export default function equivalent(obj1, obj2, processing = []) {
    if (typeof obj1 === typeof obj2) {
        if (isArray(obj1)) {
            if (obj1.length === obj2.length) {
                // Arrays have the same length
                for (let i = 0, len = obj1.length; i < len; i++) {
                    if (!equivalent(obj1[i], obj2[i], processing)) {
                        // Deep check failed.
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else if (isObject(obj1)) {
            // handle multiple object instance check.
            let processSourceIndex = processing.indexOf(obj1);
            while (processSourceIndex !== -1) {
                // `processing` array contains pairs of compared object, so left objects have always even index
                if (processSourceIndex % 2 === 0 && processing[processSourceIndex + 1] === obj2) {
                    // The comparison between the two objects has been already handled before.
                    return true;
                }
                // The same object could be compared more than once, so we have to check for all references.
                processSourceIndex = processing.indexOf(obj1, processSourceIndex);
            }
            processing.push(obj1, obj2);
            let sourceKeys = Object.keys(obj1).sort();
            let targetKeys = Object.keys(obj2).sort();
            if (equivalent(sourceKeys, targetKeys)) {
                // objects keys are equivalent.
                for (let i = 0, len = sourceKeys.length; i < len; i++) {
                    let key = sourceKeys[i];
                    if (!equivalent(obj1[key], obj2[key], processing)) {
                        // deep check failed.
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else if (isDate(obj1) && isDate(obj2)) {
            // We cannot compare two dates just using `===`, so we use their timestamps.
            return obj1.getTime() === obj2.getTime();
        } else if (isFunction(obj1.valueOf) && isFunction(obj2.valueOf)) {
            // Use `valueOf` method if available.
            return obj1.valueOf() === obj2.valueOf();
        }
        // Generic check.
        return obj1 === obj2;
    }
    // Comparison failed because object types mismatch.
    return false;
}
