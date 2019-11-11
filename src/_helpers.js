/**
 * Get object's property descriptors.
 * This method is compatible with IE 11, Safari 9 and Chrome older than 54,
 * `Object.getOwnPropertyDescriptors` isn't.
 *
 * @param {Object} obj The Object.
 * @return {Object} Descriptors' map.
 */
export function getDescriptors(obj) {
    return Object.getOwnPropertyNames(obj)
        .reduce((acc, propName) => {
            acc[propName] = Object.getOwnPropertyDescriptor(obj, propName);
            return acc;
        }, {});
}

/**
 * Build a new configurable descriptor starting from passed `descriptor`.
 * @param {Object} descriptor The descriptor to clone.
 * @param {*} val The value to set as `value` descriptor property.
 * @return {Object} New descriptor.
 */
export function buildDescriptor(descriptor, val) {
    let newDescriptor = {
        configurable: true,
        enumerable: descriptor.enumerable,
    };
    if (descriptor.get || descriptor.set) {
        newDescriptor.get = descriptor.get;
        newDescriptor.set = descriptor.set;
    } else {
        // `value` and `writable` are allowed in a descriptor only when there isn't a getter/setter.
        newDescriptor.value = val;
        newDescriptor.writable = descriptor.writable;
    }
    return newDescriptor;
}
