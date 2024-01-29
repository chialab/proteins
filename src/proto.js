/**
 * @module Proto
 */

import hasOwnProperty from './has.js';
import { isArray, isFunction, isObject } from './types.js';

const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const create = Object.create;

/**
 * Iterate all prototype chain of a class.
 * @memberof Proto
 *
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
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {Function} [filter] A filter function for the property.
 * @return {Object}
 */
export function entries(Ctr, filter = () => true) {
    const res = {};
    walk(Ctr, (proto) => {
        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (!hasOwnProperty(res, key)) {
                const descriptor = getOwnPropertyDescriptor(proto, key);
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
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @return {Array<string>}
 */
export function methods(Ctr) {
    return entries(Ctr, (key, descriptor) => isFunction(descriptor.value) && key !== 'constructor');
}

/**
 * Retrieve definitions of properties for the class.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 */
export function properties(Ctr) {
    return entries(Ctr, (key, descriptor) => !isFunction(descriptor.value));
}

/**
 * Get all definitions for a given property in the prototype chain.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to collect.
 * @return {Array<Object>}
 */
export function reduce(Ctr, property) {
    const res = [];
    walk(Ctr, (proto) => {
        const descriptor = getOwnPropertyDescriptor(proto, property);
        if (descriptor) {
            res.push(descriptor);
        }
    });
    return res;
}

/**
 * Check if a method or a property is in the prototype chain.
 * @memberof Proto
 *
 * @param {Function} Ctr The class to analyze.
 * @param {string} property The property name to verify.
 * @return {Boolean}
 */
export function has(Ctr, property) {
    return !!reduce(Ctr, property).length;
}

/**
 * Retrieve prototype of an object.
 * @memberof Proto
 *
 * @param {Object} obj The object to analyze.
 * @return {Object} The prototype.
 */
export function get(obj) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(obj);
    }
    if (isObject(obj.__proto__)) {
        return obj.__proto__;
    }
    return obj.constructor.prototype;
}

/**
 * Set prototype to an object.
 * @memberof Proto
 *
 * @param {Object} obj The object to update.
 * @param {Object|Function} proto The prototype or the class to use.
 */
export function set(obj, proto) {
    if (!isFunction(obj) && isFunction(proto)) {
        proto = proto.prototype;
    }
    Object.setPrototypeOf ? Object.setPrototypeOf(obj, proto) : (obj.__proto__ = proto);
}

/**
 * Extend a prototype.
 * @memberof Proto
 *
 * @param {Object} proto1 The prototype to extend.
 * @param {Object} proto2 The prototype to use.
 * @return {Object} The new prototype.
 */
export function extend(proto1, proto2) {
    if (isFunction(proto1)) {
        proto1 = proto1.prototype;
    }
    if (isFunction(proto2)) {
        proto2 = proto2.prototype;
    }
    return create(proto1, proto2);
}

/**
 * Create a new instance of an object without constructor.
 * @memberof Proto
 *
 * @param {Function|Object} Ctr The class or the prototype to reconstruct.
 * @return {Object} The new instance.
 */
export function reconstruct(Ctr) {
    if (isFunction(Ctr)) {
        return reconstruct(Ctr.prototype);
    } else if (isArray(Ctr)) {
        const res = [];
        set(res, Ctr);
        return res;
    }
    return create(Ctr);
}
