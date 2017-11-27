import { isObject, isDate, isArray } from './types.js';

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
                for (let i = 0, len = obj1.length; i < len; i++) {
                    if (!equivalent(obj1[i], obj2[i], processing)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else if (isObject(obj1)) {
            let processSourceIndex = processing.indexOf(obj1);
            let processTargetIndex = processing.indexOf(obj2);
            if (processSourceIndex !== -1 && processTargetIndex !== -1 && processSourceIndex % 2 === 1 && processSourceIndex === (processTargetIndex + 1)) {
                return true;
            }
            let sourceKeys = Object.keys(obj1).sort();
            let targetKeys = Object.keys(obj2).sort();
            if (equivalent(sourceKeys, targetKeys)) {
                for (let i = 0, len = sourceKeys.length; i < len; i++) {
                    let key = sourceKeys[i];
                    if (!equivalent(obj1[key], obj2[key], processing)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else if (isDate(obj1)) {
            return obj1.getTime() === obj2.getTime();
        }
        return obj1 === obj2;
    }
    return false;
}
