/**
 * A Mixin helper class.
 * @ignore
 * @private
 */
class MixinScope {
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
 * @method mix
 * @param {Function} SuperClass The class to extend.
 * @return {MixinScope} A MixinScope instance.
 */
export default function mix(SuperClass) {
    return new MixinScope(SuperClass);
}
