/**
 * @module Url
 */

import * as keypath from './keypath.js';
import Symbolic from './symbolic.js';
import { isArray, isIterable } from './types.js';
import { entries as objectEntries } from './_helpers.js';

const REF_SYM = Symbolic('ref');
const URL_REGEX = /((?:^(?:[a-z]+:))|^)?(?:\/\/)?([^?/$]*)([^?]*)?(\?.*)?/i;
const PORT_REGEX = /:\d*$/;

/**
 * Parse and split an url in its components.
 *
 * @param {string} url The url to parse.
 * @return {Object} The url properties.
 */
export function parse(url = '') {
    const hashSplit = url.split('#');
    const hash = hashSplit.length > 1 ? hashSplit.pop() : undefined;
    url = hashSplit.join('#');
    const match = url.match(URL_REGEX);
    const res = {
        host: undefined,
        hostname: undefined,
        port: undefined,
        username: undefined,
        password: undefined,
        hash,
    };
    if (match) {
        res.protocol = match[1];
        if (match[2]) {
            let host = match[2];
            res.host = host;
            const port = host.match(PORT_REGEX);
            if (port) {
                res.port = port[0].substring(1);
                host = host.replace(port[0], '');
            }
            const authSplit = host.split('@');
            res.hostname = authSplit.pop();
            const authChunk = authSplit.join('@').split(':');
            res.username = authChunk.shift();
            res.password = authChunk.join(':');
        }
        res.pathname = match[3];
        res.search = match[4];
    }
    if (!match ||
        (res.port && !res.hostname) ||
        (res.protocol && res.protocol !== 'file:' && !res.hostname) ||
        (res.search && !res.hostname && !res.pathname) ||
        (res.password && !res.username)
    ) {
        throw new SyntaxError('invalid url');
    }
    if (res.host && res.pathname === '/') {
        res.pathname = '';
    }
    if (res.hostname) {
        let origin = res.protocol ? `${res.protocol}//` : '';
        origin += res.hostname;
        origin += res.port ? `:${res.port}` : '';
        res.origin = origin;
    }
    return res;
}

/**
 * Serialize a key/value pair matching differente operators.
 *
 * @param {string} key The pair key.
 * @param {string} val The pair value.
 * @return {string} A serialized string of key/value pair.
 */
function chunk(key, val) {
    if (val) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }
    return `${encodeURIComponent(key)}`;
}

/**
 * Serialize an object in FormData format.
 *
 * @param {Object} searchParams The object to convert.
 * @param {string} prefix The prefix to use in case of recursion.
 * @param {Function} [chunkFn] The callback function to use for chunking a key/value pair.
 * @return {string} An object to serialize.
 */
export function serialize(searchParams, prefix, chunkFn = chunk) {
    const str = [];
    const entries = isIterable(searchParams) && !isArray(searchParams) ? searchParams : objectEntries(searchParams);

    for (const [propertyKey, value] of entries) {
        if (value == null) {
            continue;
        }

        const key = prefix ? `${prefix}[${propertyKey}]` : propertyKey;
        let serialized = value;
        if (value instanceof Date) {
            serialized = value.toISOString();
        }

        if (typeof serialized === 'object') {
            serialized = serialize(serialized, key);
        } else if (serialized != null) {
            serialized = chunkFn(key, `${serialized}`);
        }

        if (serialized != null) {
            str.push(serialized);
        }
    }

    if (!str.length && prefix != null) {
        str.push(chunkFn(prefix));
    }

    return str.join('&');
}

/**
 * Unserialize a string in FormData format to an object.
 *
 * @param {string} str A search string to unserialize.
 * @return {object} The unserialized object.
 */
export function unserialize(str) {
    str = decodeURI(str);
    const chunks = str.split('&');
    const res = {};

    for (let i = 0, len = chunks.length; i < len; i++) {
        const chunk = chunks[i].split('=');
        if (chunk[0] && chunk[1]) {
            const key = chunk[0].replace(/\[(.*?)\]/g, '.$1');
            const val = decodeURIComponent(chunk[1]);
            keypath.set(res, key, val);
        }
    }

    return res;
}

/**
 * Join url paths.
 *
 * @param {...string} paths A list of paths to join.
 * @return {string} The final join string.
 */
export function join(...paths) {
    return paths
        .map((path) => (path || '').replace(/^\/*/, '').replace(/\/*$/, ''))
        .filter((path) => !!path)
        .join('/');
}

/**
 * Resolve relative url path.
 *
 * @param {string} base The base path.
 * @param {string} relative The relative path.
 * @return {string} The rsolved path.
 */
export function resolve(base, relative) {
    if (relative[0] === '/') {
        const baseInfo = parse(base);
        if (!baseInfo.origin) {
            throw new Error('base url is not an absolute url');
        }
        base = `${baseInfo.origin}/`;
    }
    const stack = base.split('/');
    const parts = relative.split('/').filter((part) => part !== '');
    if (stack.length > 1) {
        stack.pop();
    }
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '.') {
            continue;
        } else if (parts[i] === '..') {
            stack.pop();
        } else {
            stack.push(parts[i]);
        }
    }
    return stack.join('/');
}

/**
 * Check if an url is absolute.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isAbsoluteUrl(url) {
    return !!parse(url).protocol;
}

/**
 * Check if an url is a data url.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isDataUrl(url) {
    return parse(url).protocol === 'data:';
}

/**
 * Check if an url points to a local file.
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isLocalUrl(url) {
    return parse(url).protocol === 'file:';
}

/**
 * Update query string params to an url
 *
 * @param {Url} url The url to update.
 * @param {string} path The query string.
 * @return {string}
 */
function updateSearchPath(url, path) {
    const href = url.href.split('?')[0];
    if (!path) {
        return url.href = href;
    }
    return url.href = `${href}?${path}`;
}

/**
 * Convert search params entries to a query string.
 *
 * @param {Array} entries Search params entries.
 * @return {string} The query string.
 */
function entriesToString(entries) {
    const unserialized = {};
    entries.forEach((entry) => {
        unserialized[entry[0]] = entry[1];
    });
    return serialize(unserialized);
}

/**
 * Search params interface for Url.
 */
export class SearchParams {
    /**
     * Create search params instance.
     * @param {Url} ref The referenced Url instance.
     */
    constructor(ref) {
        this[REF_SYM] = ref;
    }

    /**
     * The referenced Url.
     * @type {Url}
     */
    get url() {
        return this[REF_SYM];
    }

    /**
     * List all entry keys.
     *
     * @return {Array} Entry keys list.
     */
    keys() {
        return this.entries()
            .map((entry) => entry[0]);
    }

    /**
     * List all entry values.
     *
     * @return {Array} Entry values list.
     */
    values() {
        return this.entries()
            .map((entry) => entry[1]);
    }

    /**
     * List all entries.
     *
     * @return {[string, any]} Entries list in format [[key, value], [...]].
     */
    entries() {
        if (!this.url.search) {
            return [];
        }
        const search = this.url.search.substring(1);
        const unserialized = unserialize(search);
        return Object.keys(unserialized)
            .map((key) => [key, unserialized[key]]);
    }

    /**
     * Retrieve an entry.
     *
     * @param {string} name The entity name to get.
     * @return {*} The entity value.
     */
    get(name) {
        const entries = this.entries();
        for (let i = 0, len = entries.length; i < len; i++) {
            if (entries[i][0] === name) {
                return entries[i][1];
            }
        }
    }

    /**
     * Check if entity is defined.
     *
     * @param {string} name The entity name to check.
     * @return {Boolean}
     */
    has(name) {
        return !!this.get(name);
    }

    /**
     * Set an entry value.
     *
     * @param {string} name The entity name to set.
     * @param {*} value The entity value to set
     */
    set(name, value) {
        this.delete(name);
        const entries = this.entries();
        entries.push([name, value]);
        updateSearchPath(
            this.url,
            entriesToString(entries)
        );
    }

    /**
     * Remove an entity from the search params.
     *
     * @param {string} name The entity name to remove.
     */
    delete(name) {
        updateSearchPath(
            this.url,
            entriesToString(
                this.entries().filter((entry) => entry[0] !== name)
            )
        );
    }

    /**
     * Sort entities by keys names.
     */
    sort() {
        const entries = this.entries();
        entries.sort((entry1, entry2) => {
            const key1 = entry1[0];
            const key2 = entry2[0];
            if (key1 < key2) {
                return -1;
            } else if (key1 > key2) {
                return 1;
            }
            return 0;
        });
        updateSearchPath(this.url, entriesToString(entries));
    }

    toString() {
        return this.url.search;
    }
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
    constructor(path, baseUrl) {
        /**
         * The url's protocol (if defined).
         * @type {string|undefined}
         */
        this.protocol = undefined;
        /**
         * The username used (if defined).
         * @type {string|undefined}
         */
        this.username = undefined;
        /**
         * The password used (if defined).
         * @type {string|undefined}
         */
        this.password = undefined;
        /**
         * The url's host.
         * @type {string|undefined}
         */
        this.host = undefined;
        /**
         * The url's hostname.
         * @type {string|undefined}
         */
        this.hostname = undefined;
        /**
         * The url's pathname.
         * @type {string|undefined}
         */
        this.pathname = undefined;
        /**
         * The url's port (if defined).
         * @type {string|undefined}
         */
        this.port = undefined;
        /**
         * The url's query params.
         * @type {string|undefined}
         */
        this.search = undefined;
        /** The url's hash.
         * @type {string|undefined}
         */
        this.hash = undefined;
        /**
         * The full url string.
         * @type {string}
        */
        this.href = baseUrl ? resolve(baseUrl, path) : path;
        /**
         * The url query string interface.
         * @type {SearchParams}
         */
        this.searchParams = new SearchParams(this);
    }

    get href() {
        return this[REF_SYM];
    }

    set href(href) {
        const info = parse(href);
        this[REF_SYM] = href;
        for (const k in info) {
            this[k] = info[k];
        }
    }

    /**
     * Join current Url with paths.
     *
     * @param {...string} paths A list of paths to join.
     * @return {Url} A new url instance.
     */
    join(...paths) {
        return new Url(join(this.href, ...paths));
    }

    /**
     * Resolve a path relative to the current Url.
     *
     * @param {string} path The relative path.
     * @return {Url} A new url instance.
     */
    resolve(path) {
        return new Url(resolve(this.href, path));
    }

    /**
     * Check if current Url is absolute.
     *
     * @return {Boolean}
     */
    isAbsoluteUrl() {
        return isAbsoluteUrl(this.href);
    }

    /**
     * Check if current Url is a data url.
     *
     * @return {Boolean}
     */
    isDataUrl() {
        return isDataUrl(this.href);
    }

    /**
     * Check if current Url points to local file.
     *
     * @return {Boolean}
     */
    isLocalUrl() {
        return isLocalUrl(this.href);
    }

    toString() {
        return this.href;
    }
}
