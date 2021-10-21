/**
 * Create a symbolic key for objects's properties.
 *
 * @param {string} property The Symbol name.
 * @return {Symbol|Symbolic}
 */
declare function Symbolic(property: string): Symbol | typeof Symbolic;
declare namespace Symbolic {
    function isSymbolic(sym: Symbol | typeof Symbolic): boolean;
}
export default Symbolic;
