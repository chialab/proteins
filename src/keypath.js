/**
 * @module keypath
 */

import {
    isNumber,
    isString,
    isBoolean,
    isObject,
    isArray,
    isFalsy,
} from './types.js';

/**
 * Assert scope object is a valid object.
 * @private
 *
 * @param {*} obj The object to check
 * @return {boolean} The object is valid or not
 */
function assertObject(obj) {
    return !isFalsy(obj) && typeof obj === 'object';
}

/**
 * Assert scope object and path are valid
 * @private
 *
 * @param {*} obj The object to check
 * @param {*} path The property path
 * @return {void}
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
function assertArgs(obj, path) {
    if (!assertObject(obj)) {
        throw new Error('invalid scope');
    }
    if (isFalsy(path) || (isArray(path) && path.length === 0)) {
        throw new Error('invalid path');
    }
}

/**
 * Normalize path argument in an array of paths
 * @private
 *
 * @param {Array|string|number} path The argument to normalize
 * @return {Array} An array of paths
 */
function pathToArray(path) {
    if (isString(path)) {
        return path.split('.');
    }
    if (isNumber(path)) {
        return [`${path}`];
    }
    if (isArray(path)) {
        return path.slice(0);
    }
    return path;
}

/**
 * Get a deep property of an object using paths
 * @function get
 * @memberof keypath
 * 
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @return {*} The property value
 * @throws {Error} throw error when object scope is undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function get(obj, path) {
    assertArgs(obj, path);
    if (!has(obj, path)) {
        return undefined;
    }
    let value = obj;
    path = pathToArray(path);
    path.forEach(prop => {
        value = value[prop];
    });
    return value;
}

/**
 * Set a deep property of an object using paths
 * @memberof keypath
 *
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to set
 * @param {*} value The value to set
 * @param {boolean} [ensure=true] Create path if does not exists
 * @return {*} The property value
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function set(obj, path, value, ensure = true) {
    assertArgs(obj, path);
    path = pathToArray(path);
    if (path.length === 1) {
        if (isArray(obj) && path[0] === '') {
            obj.push(value);
        } else {
            obj[path[0]] = value;
        }
        return value;
    }
    let current = path.shift();
    let currentObj;
    if (!obj.hasOwnProperty(current)) {
        if (ensure) {
            let next = path[0];
            if (isNaN(next) && next !== '') {
                currentObj = obj[current] = {};
            } else {
                currentObj = obj[current] = [];
            }
        }
    } else {
        currentObj = obj[current];
    }
    return set(currentObj, path, value, ensure);
}

/**
 * Check deep object property existence using paths
 * @memberof keypath
 *
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @return {boolean} The property exists or not
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function has(obj, path) {
    if (!assertObject(obj)) {
        return false;
    }
    assertArgs(obj, path);
    path = pathToArray(path);
    let current = path.shift();
    if (isArray(obj) && !isNaN(current)) {
        current = parseInt(current);
        if (obj.length > current) {
            if (path.length === 0) {
                return true;
            }
            return has(obj[current], path);
        }
    }
    if (current in obj || obj.hasOwnProperty(current)) {
        if (path.length === 0) {
            return true;
        }
        return has(obj[current], path);
    }
    return false;
}

/**
 * Ensure the existance of a value for the given path.
 * If the value already exists, do nothing.
 * @function ensure
 * @memberof keypath
 * 
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @param {*} value The default value to set
 * @return {*} The actual value for the given property
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function ensure(obj, path, value) {
    let val = get(obj, path);
    if (!val) {
        set(obj, path, value);
    }
    return val;
}

/**
 * Push or insert a value in array.
 * @memberof keypath
 * 
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @param {*} value The value to push
 * @param {number} [index] The index to replace (empty, push at the end)
 * @return {Array} The modified array
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function insert(obj, path, value, index) {
    assertArgs(obj, path);
    path = pathToArray(path);
    let arr = [];
    arr = ensure(obj, path, arr) || arr;
    if (isArray(arr)) {
        if (!isFalsy(index)) {
            arr.splice(index, 0, value);
        } else {
            arr.push(value);
        }
    }
    return arr;
}

/**
 * Reset the value at the given path.
 * * Object → remove all keys from the object
 * * Array → remove all values from the array
 * * String → reset to empty string
 * * Number → reset to 0
 * * any → reset to null
 * @memberof keypath
 * 
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @return {*} The modified object
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function empty(obj, path) {
    assertArgs(obj, path);
    path = pathToArray(path);
    let parent = obj;
    if (path.length > 1) {
        parent = get(obj, path.slice(0, -1));
    }
    let current = path[path.length - 1];
    if (parent && parent.hasOwnProperty(current)) {
        let arr = parent[current];
        if (isArray(arr)) {
            arr.splice(0, arr.length);
        } else if (isObject(arr)) {
            for (let k in arr) {
                delete arr[k];
            }
        } else if (isString(arr)) {
            parent[current] = '';
        } else if (isNumber(arr)) {
            parent[current] = 0;
        } else if (isBoolean(arr)) {
            parent[current] = false;
        } else {
            parent[current] = null;
        }
        return arr;
    }
    return null;
}

/**
 * Remove a key from the parent path.
 * @memberof keypath
 * 
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @return {*} The parent path object
 * @throws {Error} throw error when object scope is invalid undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function del(obj, path) {
    assertArgs(obj, path);
    path = pathToArray(path);
    let pathToDelete = path.pop();
    let subObj = obj;
    if (path.length) {
        subObj = get(obj, path);
    }
    if (isObject(subObj)) {
        delete subObj[pathToDelete];
    } else if (isArray(subObj) && !isNaN(pathToDelete)) {
        subObj.splice(pathToDelete, 1);
    }
    return subObj;
}
