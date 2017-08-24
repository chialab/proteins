import { isFunction } from './types.js';

const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

/**
 * Iterate all prototype chain of a class.
 * @param {Function} Ctr The class to iterate.
 * @param {Function} [callback] A callback function for each prototype.
 * @return {Array<string>}
 */
export function walk(Ctr, callback) {
    let proto = Ctr.prototype;
    while (proto) {
        callback(proto);
        proto = Object.getPrototypeOf(proto.constructor).prototype;
    }
}

/**
 * Retrieve a list of properties and methods (with their descriptors) for the class.
 * @param {Function} Ctr The class to analyze.
 * @param {Function} [filter] A filter function for the property.
 * @return {Object}
 */
export function entries(Ctr, filter = () => true) {
    let res = {};
    walk(Ctr, (proto) => {
        Object.getOwnPropertyNames(proto)
            .forEach((key) => {
                if (!res.hasOwnProperty(key)) {
                    let descriptor = getOwnPropertyDescriptor(proto, key);
                    if (filter(key, descriptor)) {
                        res[key] = descriptor;
                    }
                }
            });
    });
    return res;
}

/**
 * Retrieve definitions of methods for the class.
 * @param {Function} Ctr The class to analyze.
 * @return {Array<string>}
 */
export function methods(Ctr) {
    return entries(Ctr, (key, descriptor) => isFunction(descriptor.value) && key !== 'constructor');
}

/**
 * Retrieve definitions of properties for the class.
 * @param {Function} Ctr The class to analyze.
 */
export function properties(Ctr) {
    return entries(Ctr, (key, descriptor) => !isFunction(descriptor.value));
}

/**
 * Get all definitions for a given property in the prototype chain.
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to collect.
 * @return {Array<Object>}
 */
export function reduce(Ctr, property) {
    let res = [];
    walk(Ctr, (proto) => {
        let descriptor = getOwnPropertyDescriptor(proto, property);
        if (descriptor && (descriptor.value || descriptor.get)) {
            res.push(descriptor.value || descriptor.get);
        }
    });
    return res;
}

/**
 * Check if a method or a property is in the prototype chain.
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to verify.
 * @return {Boolean}
 */
export function has(Ctr, property) {
    return !!reduce(Ctr, property).length;
}
