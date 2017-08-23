let support = typeof Symbol !== 'function';
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
            this.SYM = `__${property}_${count++}`;
        }
    }

    define(obj) {
        if (!support && !obj.hasOwnProperty(this.SYM)) {
            Object.defineProperty(obj, this.SYM, {
                configurable: true,
                enumerable: false,
                writable: true,
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
