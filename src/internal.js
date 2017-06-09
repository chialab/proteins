import symbolic from './symbolic.js';
const SYM = symbolic('private');

/**
 * Return a private namespace for an object.
 *
 * @method internal
 * @param {Object} object - The namespace scope.
 * @return {Object} - The namespace for the given scope.
 */
export default function internal(object) {
    if (!SYM(object)) {
        SYM(object, {});
    }
    return SYM(object);
}

/**
 * Check if the symbol is attached to an object
 *
 * @method internal.has
 * @memberof internal
 * @param {Object} object The scope to check if it has the internal symbol
 * @return {boolean} The scope has the internal symbol or not
 */
internal.has = (object) => SYM(object) !== undefined;

/**
 * Remove internal contents
 *
 * @method internal.destroy
 * @memberof internal
 * @param {Object} object The scope of the internal symbol to destroy
 */
internal.destroy = (object) => SYM(object, undefined);
