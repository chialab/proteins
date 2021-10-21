/**
 * Get a deep property of an object using paths
 * @function get
 * @memberof keypath
 *
 * @param {Object} obj The object scope
 * @param {String|Array} path The path of the property to retrieve
 * @param {*} defaultValue The default value returned if path was not found. Default is undefined.
 * @return {*} The property value
 * @throws {Error} throw error when object scope is undefined
 * @throws {Error} throw error when paths is invalid or undefined
 */
export function get(obj: Object, path: string | any[], defaultValue: any): any;
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
export function set(obj: Object, path: string | any[], value: any, ensure?: boolean | undefined): any;
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
export function has(obj: Object, path: string | any[]): boolean;
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
export function ensure(obj: Object, path: string | any[], value: any): any;
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
export function insert(obj: Object, path: string | any[], value: any, index?: number | undefined): any[];
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
export function empty(obj: Object, path: string | any[]): any;
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
export function del(obj: Object, path: string | any[]): any;
