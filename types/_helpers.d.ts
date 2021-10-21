/**
 * Get object's property descriptors.
 * This method is compatible with IE 11, Safari 9 and Chrome older than 54,
 * `Object.getOwnPropertyDescriptors` isn't.
 *
 * @param {Object} obj The Object.
 * @return {Object} Descriptors' map.
 */
export function getDescriptors(obj: Object): Object;
/**
 * Build a new configurable descriptor starting from passed `descriptor`.
 * @param {Object} descriptor The descriptor to clone.
 * @param {*} val The value to set as `value` descriptor property.
 * @param {boolean} writable Writable configuration of the descriptor.
 * @return {Object} New descriptor.
 */
export function buildDescriptor(descriptor: Object, val: any, writable?: boolean): Object;
