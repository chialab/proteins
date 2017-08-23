import * as keypath from './keypath.js';
import Symbolic from './symbolic.js';

const REF_SYM = new Symbolic('ref');

/**
 * @module Url
 */

const URL_REGEX = /((?:^(?:[a-z]+:))|^)?(?:\/\/)?([^?\/$]*)([^?]*)?(\?.*)?/i;
const PORT_REGEX = /\:\d*$/;

/**
 * @typedef {Object} UrlProperties
 * @memberof Url
 * @property {string} protocol The url's protocol (if defined).
 * @property {string} username The username used (if defined).
 * @property {string} password The password used (if defined).
 * @property {string} host The url's host.
 * @property {string} hostname The url's hostname.
 * @property {string} port The url's port (if defined).
 * @property {string} search The url's query params.
 * @property {string} hash The url's hash.
 */
// eslint-disable-next-line
function UrlProperties() { }

/**
 * Parse and split an url in its components.
 * @memberof Url
 *
 * @param {string} url The url to parse.
 * @return {UrlProperties} The url properties
 */
export function parse(url = '') {
    let hashSplit = url.split('#');
    let hash = hashSplit.length > 1 ? hashSplit.pop() : undefined;
    url = hashSplit.join('#');
    let match = url.match(URL_REGEX);
    let res = {
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
            let port = host.match(PORT_REGEX);
            if (port) {
                res.port = port[0].substring(1);
                host = host.replace(port[0], '');
            }
            let authSplit = host.split('@');
            res.hostname = authSplit.pop();
            let authChunk = authSplit.join('@').split(':');
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
 * @private
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
 * @memberof Url
 *
 * @param {Object} obj The object to convert.
 * @param {string} prefix The prefix to use in case of recursion.
 * @param {Function} chunkFn? The callback function to use for chunking a key/value pair.
 * @return {string} An object to serialize.
 */
export function serialize(obj, prefix, chunkFn = chunk) {
    let str = [];
    let keys = Object.keys(obj);
    if (keys.length) {
        for (let p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
                let k = prefix ? `${prefix}[${p}]` : p;
                let v = obj[p];
                if (v instanceof Date) {
                    v = v.toISOString();
                }
                str.push(
                    (v !== null && typeof v === 'object') ?
                    serialize(v, k) :
                    chunkFn(k, `${v}`)
                );
            }
        }
    } else if (prefix) {
        str.push(chunkFn(prefix));
    }
    return str.join('&');
}

/**
 * Unserialize a string in FormData format to an object.
 * @memberof Url
 *
 * @param {string} str A search string to unserialize.
 * @return {object} The unserialized object.
 */
export function unserialize(str) {
    str = decodeURI(str);
    let chunks = str.split('&');
    let res = {};

    for (let i = 0, len = chunks.length; i < len; i++) {
        let chunk = chunks[i].split('=');
        if (chunk[0] && chunk[1]) {
            let key = chunk[0].replace(/\[(.*?)\]/g, '.$1');
            let val = decodeURIComponent(chunk[1]);
            keypath.set(res, key, val);
        }
    }

    return res;
}

/**
 * Join url paths.
 * @memberof Url
 *
 * @param {...string} paths A list of paths to join.
 * @return {string} The final joint string.
 */
export function join(...paths) {
    let len = paths.length - 1;
    return paths
        .filter((path) => !!path)
        .map((path, index) => {
            if (index === 0) {
                return path.replace(/\/*$/, '');
            } else if (index === len) {
                return path.replace(/^\/*/, '');
            }
            return path.replace(/^\/*/, '').replace(/\/*$/, '');
        })
        .join('/');
}

/**
 * Resolve relative url path.
 * @memberof Url
 *
 * @param {string} base The base path.
 * @param {string} relative The relative path.
 * @return {string} The rsolved path.
 */
export function resolve(base, relative) {
    if (relative[0] === '/') {
        let baseInfo = parse(base);
        if (!baseInfo.origin) {
            throw new Error('base url is not an absolute url');
        }
        base = baseInfo.origin;
    }
    let stack = base.split('/');
    let parts = relative.split('/').filter((part) => part !== '');
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
 * @memberof Url
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isAbsoluteUrl(url) {
    return !!parse(url).protocol;
}

/**
 * Check if an url is a data url.
 * @memberof Url
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isDataUrl(url) {
    return parse(url).protocol === 'data:';
}

/**
 * Check if an url points to a local file.
 * @memberof Url
 *
 * @param {string} url The url to check.
 * @return {boolean}
 */
export function isLocalUrl(url) {
    return parse(url).protocol === 'file:';
}

/**
 * Update query string params to an url
 * @private
 *
 * @param {Url} url The url to update.
 * @param {string} path The query string.
 */
function updateSearchPath(url, path) {
    let href = url.href.split('?')[0];
    url.href = `${href}?${path}`;
}

/**
 * Convert search params entries to a query string.
 * @private
 *
 * @param {Array} entries Search params entries.
 * @return {string} The query string.
 */
function entriesToString(entries) {
    let unserialized = {};
    entries.forEach((entry) => {
        unserialized[entry[0]] = entry[1];
    });
    return serialize(unserialized);
}

/**
 * Search params interface for Url.
 * @class SearchParams
 * @memberof Url
 * @property {Url} url The referenced Url.
 *
 * @param {Url} ref The referenced Url instance.
 */
export class SearchParams {
    constructor(ref) {
        REF_SYM.define(this);
        this[REF_SYM] = ref;
    }

    get url() {
        return this[REF_SYM];
    }

    /**
     * List all entry keys.
     * @memberof Url.SearchParams
     *
     * @return {Array} Entry keys list.
     */
    keys() {
        return this.entries()
            .map((entry) => entry[0]);
    }

     /**
     * List all entry values.
     * @memberof Url.SearchParams
     *
     * @return {Array} Entry values list.
     */
    values() {
        return this.entries()
            .map((entry) => entry[1]);
    }

    /**
     * List all entries.
     * @memberof Url.SearchParams
     *
     * @return {Array} Entries list in format [[key, value], [...]].
     */
    entries() {
        let search = this.url.search.substring(1);
        let unserialized = unserialize(search);
        return Object.keys(unserialized)
            .map((key) => [key, unserialized[key]]);
    }

    /**
     * Retrieve an entry.
     * @memberof Url.SearchParams
     *
     * @param {string} name The entity name to get.
     * @return {*} The entity value.
     */
    get(name) {
        let entries = this.entries();
        for (let i = 0, len = entries.length; i < len; i++) {
            if (entries[i][0] === name) {
                return entries[i][1];
            }
        }
    }

    /**
     * Check if entity is defined.
     * @memberof Url.SearchParams
     *
     * @param {string} name The entity name to check.
     * @return {Boolean}
     */
    has(name) {
        return !!this.get(name);
    }

    /**
     * Set an entry value.
     * @memberof Url.SearchParams
     *
     * @param {string} name The entity name to set.
     * @param {*} value The entity value to set
     */
    set(name, value) {
        this.delete(name);
        let entries = this.entries();
        entries.push([name, value]);
        updateSearchPath(
            this.url,
            entriesToString(entries)
        );
    }

    /**
     * Remove an entity from the search params.
     * @memberof Url.SearchParams
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
     * @memberof Url.SearchParams
     */
    sort() {
        let entries = this.entries();
        entries.sort((entry1, entry2) => {
            let key1 = entry1[0];
            let key2 = entry2[0];
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
 * @class Url
 * @memberof Url
 * @property {string} href The full url string.
 * @property {SearchParams} searchParams The url query string interface.
 *
 * @param {string} path The url to handle.
 * @param {string} baseUrl? The optional base url. 
 */
export class Url {
    constructor(path, baseUrl) {
        if (baseUrl) {
            this.href = resolve(baseUrl, path);
        } else {
            this.href = path;
        }
        this.searchParams = new SearchParams(this);
        REF_SYM.define(this);
    }

    get href() {
        return this[REF_SYM];
    }

    set href(href) {
        let info = parse(href);
        this[REF_SYM] = href;
        for (let k in info) {
            this[k] = info[k];
        }
    }

    /**
     * Join current Url with paths.
     * @memberof Url.Url
     *
     * @param {,,,string} paths A list of paths to join.
     * @return {Url} A new url instance.
     */
    join(...paths) {
        return new Url(join(this.href, ...paths));
    }

    /**
     * Resolve a path relative to the current Url.
     * @memberof Url.Url
     *
     * @param {string} path The relative path.
     * @return {Url} A new url instance.
     */
    resolve(path) {
        return new Url(resolve(this.href, path));
    }

    /**
     * Check if current Url is absolute.
     * @memberof Url.Url
     *
     * @return {Boolean}
     */
    isAbsoluteUrl() {
        return isAbsoluteUrl(this.href);
    }

    /**
     * Check if current Url is a data url.
     * @memberof Url.Url
     *
     * @return {Boolean}
     */
    isDataUrl() {
        return isDataUrl(this.href);
    }

    /**
     * Check if current Url points to local file.
     * @memberof Url.Url
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
