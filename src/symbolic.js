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

    /**
     * Check if an object has a Symbolic definition.
     *
     * @param {Object} object The scope to check if it has the symbol
     * @return {boolean} The scope has the symbol or not
     */
    has(object) {
        return object.hasOwnProperty(this);
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
