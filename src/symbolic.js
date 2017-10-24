let count = 0;
let support = (() => {
    try {
        if (typeof Symbol === 'function') {
            class Test {
                toString() {
                    return Symbol();
                }
            }
            new Object({
                [new Test()]: 0,
            });
            return true;
        }
    } catch (ex) {
        //
    }
    return false;
})();

const registry = [];

/**
 * Create a symbolic key for objects's properties.
 *
 * @class Symbolic
 * @param {string} property The Symbol name
 */
export default class Symbolic {
    static isSymbolic(sym) {
        if (sym instanceof Symbolic) {
            return true;
        }
        return sym && (
            support ?
                (sym.constructor === Symbol) :
                (registry.indexOf(sym) !== -1)
        );
    }

    constructor(property) {
        if (support) {
            this.SYM = Symbol(property);
        } else {
            let sym = this.SYM = `__${property}_${count++}`;
            registry.push(sym);
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
