const support = (typeof Symbol === 'function');

/**
 * Polyfill registry for symbols.
 * @private
 * @type {Array}
 */
const registry = [];

/**
 * Polyfill for Symbol.
 * @class SymbolPolyfill
 * @private
 *
 * @param {string} property The Symbol name.
 */
class SymbolPolyfill {
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
export default function Symbolic(property) {
    if (support) {
        // native Symbol support.
        let sym = Symbol(property);
        registry.push(sym);
        return sym;
    }
    return new SymbolPolyfill(property);
}

/**
 * Check if an instance is a Symbol.
 * @param {Symbol|Symbolic} sym The symbol to check.
 * @return {Boolean}
 */
Symbolic.isSymbolic = function(sym) {
    if (sym instanceof SymbolPolyfill) {
        return true;
    }
    return sym && (support && registry.indexOf(sym) !== -1);
};
