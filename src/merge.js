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
 * @param {Object|Array} obj1 The initial object.
 * @param {Object|Array} obj2 The object to merge.
 * @param {MergeOptions} options Merge options.
 * @return {Object} The merged object.
 *
 * @example
 * // plain objects
 * let package = {
 *   name: 'proteins',
 *   version: '1.0.0',
 *   tags: ['javascript'],
 *   devDependencies: {
 *     gulp: '3.5.0',
 *     karma: '1.3.0',
 *   },
 * };
 * let update = {
 *   version: '1.1.0',
 *   author: "Chialab",
 *   tags: ['utils'],
 *   devDependencies: {
 *     gulp: '3.9.0',
 *     mocha: '3.0.0',
 *   },
 * };
 * @example
 * let newPackage = merge(package, update);
 *
 * newPackage.name                     // -> "proteins"
 * newPackage.version                  // -> "1.1.0"
 * newPackage.author                   // -> "Chialab"
 * newPackage.tags.length              // -> 1
 * newPackage.tags[0]                  // -> "utils"
 * newPackage.tags[1]                  // -> undefined
 * newPackage.devDependencies.gulp     // -> "3.9.0"
 * newPackage.devDependencies.karma    // -> "1.3.0"
 * newPackage.devDependencies.mocha    // -> "3.0.0"
 * @example
 * let newPackage = merge(package, update, { mergeObjects: false });
 *
 * newPackage.name                     // -> "proteins"
 * newPackage.version                  // -> "1.1.0"
 * newPackage.author                   // -> "Chialab"
 * newPackage.tags.length              // -> 1
 * newPackage.tags[0]                  // -> "utils"
 * newPackage.tags[1]                  // -> undefined
 * newPackage.devDependencies.gulp     // -> "3.9.0"
 * newPackage.devDependencies.karma    // -> undefined
 * newPackage.devDependencies.mocha    // -> "3.0.0"
 * @example
 * let newPackage = merge(package, update, { joinArrays: true });
 *
 * newPackage.name                     // -> "proteins"
 * newPackage.version                  // -> "1.1.0"
 * newPackage.author                   // -> "Chialab"
 * newPackage.tags.length              // -> 2
 * newPackage.tags[0]                  // -> "javascript"
 * newPackage.tags[1]                  // -> "utils"
 * newPackage.devDependencies.gulp     // -> "3.9.0"
 * newPackage.devDependencies.karma    // -> "1.3.0"
 * newPackage.devDependencies.mocha    // -> undefined
 * @example
 * let newPackage = merge(package, update, { strictMerge: true });
 *
 * newPackage.name                     // -> "proteins"
 * newPackage.version                  // -> "1.1.0"
 * newPackage.author                   // -> undefined
 * newPackage.tags.length              // -> 1
 * newPackage.tags[0]                  // -> "utils"
 * newPackage.tags[1]                  // -> undefined
 * newPackage.devDependencies.gulp     // -> "3.9.0"
 * newPackage.devDependencies.karma    // -> "1.3.0"
 * newPackage.devDependencies.mocha    // -> "3.0.0"
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
