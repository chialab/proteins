/**
 * Add a callback for the specified trigger.
 *
 * @param {Object} scope The event scope
 * @param {String} name The event name
 * @param {Function} callback The callback function
 * @return {Function} Destroy created listener with this function
 */
export function on(scope: Object, name: string, callback: Function): Function;
/**
 * Remove one or multiple listeners.
 *
 * @param {Object} scope The event scope
 * @param {String} [name] Optional event name to reset
 * @param {Function} [callback] Callback to remove (empty, removes all listeners).
 */
export function off(scope: Object, name?: string | undefined, callback?: Function | undefined): void;
/**
 * Trigger a callback.
 *
 * @param {Object} scope The event scope
 * @param {String} name Event name
 * @param {...*} args Arguments to pass to callbacks
 * @return {Promise} The final Promise of the callbacks chain
 */
export function trigger(scope: Object, name: string, ...args: any[]): Promise<any>;
