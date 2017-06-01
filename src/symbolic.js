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
    let fn = (obj, ...args) => {
        if (!hasOwnProperty.call(obj, SYM)) {
            Object.defineProperty(obj, SYM, {
                enumerable: false,
                configurable: false,
                writable: true,
                value: undefined,
            });
        }
        if (args.length) {
            obj[SYM] = args[0];
        }
        return obj[SYM];
    };

    fn.has = (obj) => hasOwnProperty.call(obj, SYM);

    return fn;
}
