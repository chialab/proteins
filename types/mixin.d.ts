/**
 * Mix a class with a mixin.
 * Inspired by Justin Fagnani (https://github.com/justinfagnani).
 *
 * @param {Function} SuperClass The class to extend.
 * @return {MixinScope} A MixinScope instance.
 */
export default function mix(SuperClass: Function): MixinScope;
/**
 * A Mixin helper class.
 */
export class MixinScope {
    /**
     * Create a mixable class.
     * @param {Function} superClass The class to extend.
     */
    constructor(superClass: Function);
    superClass: Function;
    /**
     * Mix the super class with a list of mixins.
     *
     * @param {...Function} mixins *N* mixin functions.
     * @return {*} The extended class.
     */
    with(...mixins: Function[]): any;
    /**
     * Check if the SuperClass has been already mixed with a mixin function.
     *
     * @param {Function} mixin The mixin function.
     * @return {Boolean}
     */
    has(mixin: Function): boolean;
}
