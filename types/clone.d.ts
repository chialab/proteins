/**
 * Clone an object.
 *
 * @method clone
 * @param {*} obj The instance to clone.
 * @param {Function} [callback] A modifier function for each property.
 * @param {boolean} [useStrict] Should preserve frozen and sealed objects.
 * @param {WeakMap} [cache] The cache for circular references.
 * @return {*} The clone of the object.
 */
export default function clone(obj: any, callback?: Function | undefined, useStrict?: boolean | undefined, cache?: WeakMap<any, any> | undefined): any;
