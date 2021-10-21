/**
 * Parse and split an url in its components.
 *
 * @param {string} url The url to parse.
 * @return {Object} The url properties.
 */
export function parse(url?: string): Object;
/**
 * Serialize an object in FormData format.
 *
 * @param {Object} obj The object to convert.
 * @param {string} prefix The prefix to use in case of recursion.
 * @param {Function} [chunkFn] The callback function to use for chunking a key/value pair.
 * @return {string} An object to serialize.
 */
export function serialize(obj: Object, prefix: string, chunkFn?: Function | undefined): string;
/**
 * Unserialize a string in FormData format to an object.
 *
 * @param {string} str A search string to unserialize.
 * @return {object} The unserialized object.
 */
export function unserialize(str: string): object;
/**
 * Join url paths.
 *
 * @param {...string} paths A list of paths to join.
 * @return {string} The final join string.
 */
export function join(...paths: string[]): string;
/**
 * Resolve relative url path.
 *
 * @param {string} base The base path.
 * @param {string} relative The relative path.
 * @return {string} The rsolved path.
 */
export function resolve(base: string, relative: string): string;
/**
 * Check if an url is absolute.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isAbsoluteUrl(url: string): boolean;
/**
 * Check if an url is a data url.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isDataUrl(url: string): boolean;
/**
 * Check if an url points to a local file.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isLocalUrl(url: string): boolean;
/**
 * Search params interface for Url.
 */
export class SearchParams {
    /**
     * Create search params instance.
     * @param {Url} ref The referenced Url instance.
     */
    constructor(ref: Url);
    /**
     * The referenced Url.
     * @type {Url}
     */
    get url(): Url;
    /**
     * List all entry keys.
     *
     * @return {Array} Entry keys list.
     */
    keys(): any[];
    /**
     * List all entry values.
     *
     * @return {Array} Entry values list.
     */
    values(): any[];
    /**
     * List all entries.
     *
     * @return {Array} Entries list in format [[key, value], [...]].
     */
    entries(): any[];
    /**
     * Retrieve an entry.
     *
     * @param {string} name The entity name to get.
     * @return {*} The entity value.
     */
    get(name: string): any;
    /**
     * Check if entity is defined.
     *
     * @param {string} name The entity name to check.
     * @return {Boolean}
     */
    has(name: string): boolean;
    /**
     * Set an entry value.
     *
     * @param {string} name The entity name to set.
     * @param {*} value The entity value to set
     */
    set(name: string, value: any): void;
    /**
     * Remove an entity from the search params.
     *
     * @param {string} name The entity name to remove.
     */
    delete(name: string): void;
    /**
     * Sort entities by keys names.
     */
    sort(): void;
    toString(): string | undefined;
}
/**
 * Url helper class.
 */
export class Url {
    /**
     * Create a Url instance.
     * @param {string} path The url to handle.
     * @param {string} [baseUrl] The optional base url.
     */
    constructor(path: string, baseUrl?: string | undefined);
    /**
     * The url's protocol (if defined).
     * @type {string|undefined}
     */
    protocol: string | undefined;
    /**
     * The username used (if defined).
     * @type {string|undefined}
     */
    username: string | undefined;
    /**
     * The password used (if defined).
     * @type {string|undefined}
     */
    password: string | undefined;
    /**
     * The url's host.
     * @type {string|undefined}
     */
    host: string | undefined;
    /**
     * The url's hostname.
     * @type {string|undefined}
     */
    hostname: string | undefined;
    /**
     * The url's pathname.
     * @type {string|undefined}
     */
    pathname: string | undefined;
    /**
     * The url's port (if defined).
     * @type {string|undefined}
     */
    port: string | undefined;
    /**
     * The url's query params.
     * @type {string|undefined}
     */
    search: string | undefined;
    /** The url's hash.
     * @type {string|undefined}
     */
    hash: string | undefined;
    set href(arg: any);
    get href(): any;
    /**
     * The url query string interface.
     * @type {SearchParams}
     */
    searchParams: SearchParams;
    /**
     * Join current Url with paths.
     *
     * @param {...string} paths A list of paths to join.
     * @return {Url} A new url instance.
     */
    join(...paths: string[]): Url;
    /**
     * Resolve a path relative to the current Url.
     *
     * @param {string} path The relative path.
     * @return {Url} A new url instance.
     */
    resolve(path: string): Url;
    /**
     * Check if current Url is absolute.
     *
     * @return {Boolean}
     */
    isAbsoluteUrl(): boolean;
    /**
     * Check if current Url is a data url.
     *
     * @return {Boolean}
     */
    isDataUrl(): boolean;
    /**
     * Check if current Url points to local file.
     *
     * @return {Boolean}
     */
    isLocalUrl(): boolean;
    toString(): any;
}
