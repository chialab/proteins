let support = typeof Symbol === 'function';
let count = 0;

/**
 * Create a getter/setter for symbolic objects's properties.
 *
 * @class Symbolic
 */
export default class Symbolic {
    constructor(property) {
        if (support) {
            this.SYM = Symbol(property);
        } else {
            let sym = this.SYM = `__${property}_${count++}`;
            Object.defineProperty(Object.prototype, sym, {
                configurable: true,
                enumerable: false,
                set(x) {
                    Object.defineProperty(this, sym, {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: x,
                    });
                },
            });
        }
    }

    toString() {
        return this.SYM;
    }
}
