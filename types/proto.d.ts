/**
 * Iterate all prototype chain of a class.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to iterate.
 * @param {Function} [callback] A callback function for each prototype.
 * @return {Array<string>}
 */
export function walk(Ctr: Function, callback?: Function | undefined): Array<string>;
/**
 * Retrieve a list of properties and methods (with their descriptors) for the class.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {Function} [filter] A filter function for the property.
 * @return {Object}
 */
export function entries(Ctr: Function, filter?: Function | undefined): Object;
/**
 * Retrieve definitions of methods for the class.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @return {Array<string>}
 */
export function methods(Ctr: Function): Array<string>;
/**
 * Retrieve definitions of properties for the class.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 */
export function properties(Ctr: Function): Object;
/**
 * Get all definitions for a given property in the prototype chain.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to collect.
 * @return {Array<Object>}
 */
export function reduce(Ctr: Function, property: string): Array<Object>;
/**
 * Check if a method or a property is in the prototype chain.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to verify.
 * @return {Boolean}
 */
export function has(Ctr: Function, property: string): boolean;
/**
 * Retrieve prototype of an object.
 * @memberof Proto
 *
 * @param {Object} obj The object to analyze.
 * @return {Object} The prototype.
 */
export function get(obj: Object): Object;
/**
 * Set prototype to an object.
 * @memberof Proto
 *
 * @param {Object} obj The object to update.
 * @param {Object|Function} proto The prototype or the class to use.
 */
export function set(obj: Object, proto: Object | Function): void;
/**
 * Extend a prototype.
 * @memberof Proto
 *
 * @param {Object} proto1 The prototype to extend.
 * @param {Object} proto2 The prototype to use.
 * @return {Object} The new prototype.
 */
export function extend(proto1: Object, proto2: Object): Object;
/**
 * Create a new instance of an object without constructor.
 * @memberof Proto
 *
 * @param {Function|Object} Ctr The class or the prototype to reconstruct.
 * @return {Object} The new instance.
 */
export function reconstruct(Ctr: Function | Object): Object;
