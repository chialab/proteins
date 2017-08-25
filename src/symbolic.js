let support = typeof Symbol === 'function';
let count = 0;

/**
 * Create a symbolic key for objects's properties.
 *
 * @class Symbolic
 * @param {string} property The Symbol name
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

try {
    if (support) {
        let check = new Symbolic('check');
        let test = {};
        test[check] = 2;
    }
} catch(ex) {
    support = false;
}
