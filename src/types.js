/**
 * Check if a value is a function.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isFunction(obj) {
    return typeof obj === 'function';
}
/**
 * Check if a value is a string.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isString(obj) {
    return typeof obj === 'string';
}
/**
 * Check if a value is a number.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isNumber(obj) {
    return typeof obj === 'number' && !isNaN(obj);
}
/**
 * Check if a value is a bool.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isBoolean(obj) {
    return typeof obj === 'boolean';
}
/**
 * Check if a value is a date.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isDate(obj) {
    return obj instanceof Date;
}
/**
 * Check if a value is an object.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check if a value is undefined.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isUndefined(obj) {
    return typeof obj === 'undefined';
}
/**
 * Check if a value is an array.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isArray(obj) {
    return Array.isArray(obj) || obj instanceof Array;
}
/**
 * Check if falsy value.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isFalsy(obj) {
    return isUndefined(obj) || obj === null || obj === false || (typeof obj === 'number' && isNaN(obj));
}

/**
 * Check if input is iterable.
 * @param {*} input
 * @returns {input is Iterable<any>} True if input is iterable.
 */
export function isIterable(input) {
    if (input == null || typeof input !== 'object') {
        return false
    }

    return typeof input[Symbol.iterator] === 'function';
}
