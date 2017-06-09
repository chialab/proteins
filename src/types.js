/**
 * Check if a value is a function.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isFunction(() => {})        // -> true
 * isFunction(Object.toString) // -> true
 * isFunction(class {})        // -> true
 */
export function isFunction(obj) {
    return typeof obj === 'function';
}
/**
 * Check if a value is a string.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isString('hello') // -> true
 * isString('2')     // -> true
 */
export function isString(obj) {
    return typeof obj === 'string';
}
/**
 * Check if a value is a number.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isNumber(2)   // -> true
 * isNumber('2') // -> false
 * isNumber(NaN) // -> false
 */
export function isNumber(obj) {
    return typeof obj === 'number' && !isNaN(obj);
}
/**
 * Check if a value is a bool.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isBoolean(false) // -> true
 * isBoolean(true)  // -> true
 */
export function isBoolean(obj) {
    return typeof obj === 'boolean';
}
/**
 * Check if a value is a date.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isDate(new Date())   // -> true
 * isDate('2017/05/12') // -> false
 */
export function isDate(obj) {
    return obj instanceof Date;
}
/**
 * Check if a value is an object.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isObject({})         // -> true
 * isObject(new Date()) // -> false
 */
export function isObject(obj) {
    return !isDate(obj) && !isArray(obj) && Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check if a value is undefined.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isUndefined(undefined) // -> true
 * isUndefined(null)      // -> false
 */
export function isUndefined(obj) {
    return typeof obj === 'undefined';
}
/**
 * Check if a value is an array.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isArray([1, 2, 3])              // -> true
 * isArray(document.body.children) // -> false
 */
export function isArray(obj) {
    return Array.isArray(obj);
}
/**
 * Check if falsy value.
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 *
 * @example
 * isFalsy(null)      // -> true
 * isFalsy(undefined) // -> true
 * isFalsy(false)     // -> true
 * isFalsy(0)         // -> false
 * isFalsy('')        // -> false
 */
export function isFalsy(obj) {
    return isUndefined(obj) || obj === null || obj === false || (typeof obj === 'number' && isNaN(obj));
}
