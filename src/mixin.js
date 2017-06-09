/**
 * A Mixin helper class.
 * @private
 */
class Mixin {
    /**
     * Create a mixable class.
     * @param {Function} superClass The class to extend.
     */
    constructor(superclass) {
        superclass = superclass || class { };
        this.superclass = superclass;
    }
    /**
     * Mix the super class with a list of mixins.
     * @param {...Function} mixins *N* mixin functions.
     * @return {Function} The extended class.
     */
    with(...args) {
        let Class = this.superclass;
        args.forEach((mixin) => {
            Class = mixin(Class);
        });
        return Class;
    }
}

/**
 * Mix a class with a mixin.
 * Inspired by Justin Fagnani (https://github.com/justinfagnani).
 *
 * @param {Function} superClass The class to extend.
 * @return {Function} A mixed class.
 *
 * @example
 * // my-super.js
 * export class MySuperClass {
 *     constructor() {
 *         // do something
 *     }
 * }
 * @example
 * // mixin.js
 * export const Mixin = (superClass) => class extends superClass {
 *     constructor() {
 *         super();
 *         // do something else
 *     }
 * };
 * @example
 * import { mix } from '@chialab/proteins';
 * import { MySuperClass } from './my-super.js';
 * import { Mixin } from './mixin.js';
 *
 * export class MixedClass extends mix(MySuperClass).with(Mixin) {
 *     ...
 * }
 */
export default function mix(superClass) {
    return new Mixin(superClass);
}
