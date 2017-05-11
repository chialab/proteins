const hasOwnProperty = Object.hasOwnProperty;

/**
 * Return a symbolic property getter/setter.
 *
 * @param {string} property The symbolic property name.
 * @return {Function} The property getter/setter.
 */
export default function symbolic(property) {
    let SYM = `__${property}`;
    if (typeof Symbol !== 'undefined') {
        SYM = Symbol(property);
    }
    return (obj, val) => {
        if (!hasOwnProperty.call(obj, SYM)) {
            Object.defineProperty(obj, SYM, {
                enumerable: false,
                configurable: false,
                writable: true,
                value: undefined,
            });
        }
        if (val) {
            obj[SYM] = val;
        }
        return obj[SYM];
    };
}
