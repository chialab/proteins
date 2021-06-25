import Symbolic from './symbolic.js';
import hasOwnProperty from './has.js';

const MIXINS_SYM = Symbolic('mixins');

/**
 * Mix a class with a mixin.
 * Inspired by Justin Fagnani (https://github.com/justinfagnani).
 *
 * @param {Function} SuperClass The class to extend.
 * @return {MixinScope} A MixinScope instance.
 */
export default function mix(SuperClass) {
    return new MixinScope(SuperClass);
}

/**
 * A Mixin helper class.
 */
export class MixinScope {
    /**
     * Create a mixable class.
     * @param {Function} superClass The class to extend.
     */
    constructor(superClass) {
        this.superClass = superClass || class { };
    }
    /**
     * Mix the super class with a list of mixins.
     *
     * @param {...Function} mixins *N* mixin functions.
     * @return {*} The extended class.
     */
    with(...mixins) {
        let Class = this.superClass;
        mixins.forEach((mixin) => {
            if (!this.has(mixin)) {
                Class = mixin(Class);
            }
        });
        Class[MIXINS_SYM] = hasOwnProperty(Class, MIXINS_SYM) ? Class[MIXINS_SYM] : [];
        Class[MIXINS_SYM].push(...mixins);
        return Class;
    }
    /**
     * Check if the SuperClass has been already mixed with a mixin function.
     *
     * @param {Function} mixin The mixin function.
     * @return {Boolean}
     */
    has(mixin) {
        let Class = this.superClass;
        while (Class && Class !== Object) {
            const attached = Class[MIXINS_SYM] || [];
            if (attached.indexOf(mixin) !== -1) {
                return true;
            }
            Class = Object.getPrototypeOf(Class);
        }
        return false;
    }
}
