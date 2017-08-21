const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const PRIVATE_FIELD = {};

export default class Symbolic {
    constructor(property) {
        this.SYM = `__${property}`;
        if (typeof Symbol !== 'undefined') {
            this.SYM = Symbol(property);
        }
    }

    /**
     * Get Symbolic property of an object.
     *
     * @param {Object} object The scope of the property
     * @return {*} The scope property value
     */
    get(object) {
        return object[this.SYM];
    }

    /**
     * Set Symbolic property of an object.
     *
     * @param {Object} object The scope of the property
     * @param {*} The data to set
     */
    set(object, data) {
        if (!this.has(object)) {
            Object.defineProperty(object, this.SYM, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: undefined,
            });
        }
        object[this.SYM] = data;
    }

    /**
     * Check if an object has a Symbolic definition.
     *
     * @param {Object} object The scope to check if it has the symbol
     * @return {boolean} The scope has the symbol or not
     */
    has(object) {
        let descriptor = getOwnPropertyDescriptor(object, this.SYM);
        return descriptor && descriptor.writable && descriptor.value !== PRIVATE_FIELD;
    }

    /**
     * Block Symbolic definition on object
     *
     * @method destroy
     * @param {Object} object The scope of the internal symbol to destroy
     */
    destroy(object) {
        if (this.has(object)) {
            Object.defineProperty(object, this.SYM, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: PRIVATE_FIELD,
            });
        }
    }
}

