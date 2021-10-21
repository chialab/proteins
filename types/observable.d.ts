/**
 * Create an Observable object for a set of data or an array.
 *
 * @param {Object|Array} data The object to observe.
 * @return {Proxy} The observed object proxy.
 */
export default class Observable {
    /**
     * Re-observe an array or an object after adding a property.
     *
     * You should invoke this static method only after adding a new property
     * to an object, and only if you wish to support browsers that do not have
     * native Proxy object. This is required because it is impossible to
     * intercept new properties added to an existing object from the polyfill.
     *
     * ## Example
     *
     * ```js
     * const myObservable = new Observable({ foo: 'foo' });
     *
     * // This is not enough to trigger changes in older browsers!
     * myObservable.bar = 'bar';
     *
     * // So, you should invoke this immediately after:
     * Observable.reobserve(myObservable);
     * ```
     *
     * @param {Object|Array} data Data to be re-observed.
     * @return {void}
     */
    static reobserve(data: Object | any[]): void;
    constructor(data: any);
}
export type ChangeSet = {
    /**
     * The path to the changed property.
     */
    property: string;
    /**
     * The old value for the property.
     */
    oldValue: any;
    /**
     * The new value for the property.
     */
    newValue: any;
    /**
     * A list of added items to an array.
     */
    added: any[];
    /**
     * A list of remove items from an array.
     */
    remove: any[];
};
