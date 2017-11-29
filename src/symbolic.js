const support = (typeof Symbol === 'function');

/**
 * Polyfill registry for symbols.
 * @type {Array}
 */
const registry = [];

/**
 * Polyfill for Symbol.
 *
 * @class Symbolic
 * @param {string} property The Symbol name.
 */
class Symbolic {
    constructor(property) {
        let sym = this.SYM = `__${property}_${registry.length}`;
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

    toString() {
        return this.SYM;
    }
}

/**
 * Create a symbolic key for objects's properties.
 *
 * @param {string} property The Symbol name.
 * @return {Symbol|Symbolic}
 */
export default function SymbolicFactory(property) {
    if (support) {
        // native Symbol support.
        return Symbol(property);
    }
    return Symbolic(property);
}

/**
 * Check if an instance is a Symbol.
 * @param {Symbol|Symbolic} sym The symbol to check.
 * @return {Boolean}
 */
SymbolicFactory.isSymbolic = function(sym) {
    if (sym instanceof Symbolic) {
        return true;
    }
    return sym && (
        support ?
            (sym.constructor === Symbol) :
            (registry.indexOf(sym) !== -1)
    );
};
