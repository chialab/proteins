import symbolic from './symbolic.js';
const SYM = symbolic('private');

/**
 * Return a private namespace for an object.
 *
 * @param {*} object The namespace scope.
 * @return {Object} The namespace for the given scope.
 */
export default function internal(object) {
    if (!SYM(object)) {
        SYM(object, {});
    }
    return SYM(object);
}

internal.has = (object) => SYM(object) !== undefined;

internal.destroy = (object) => SYM(object, undefined);
