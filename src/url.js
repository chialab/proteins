import internal from './internal.js';
import keypath from './keypath.js';

export const URL_REGEX = /((?:^(?:[a-z]+:))|^)?(?:\/\/)?([^?\/$]*)([^?]*)?(\?.*)?/i;

const PORT_REGEX = /\:\d*$/;

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
 * Serialize an object in FormData format.
 * @param {Object} obj The object to convert.
 * @param {string} prefix? The prefix to use in case of recursion.
 * @return {string} An object to serialize.
 */
export function serialize(obj, prefix) {
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
                    `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
                );
            }
        }
    } else if (prefix) {
        str.push(`${encodeURIComponent(prefix)}`);
    }
    return str.join('&');
}
/**
 * Unserialize a string in FormData format to an object.
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
            keypath(res, key, val);
        }
    }

    return res;
}

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

export function isAbsoluteUrl(url) {
    return !!parse(url).protocol;
}

export function isDataUrl(url) {
    return parse(url).protocol === 'data:';
}

export function isLocalUrl(url) {
    return parse(url).protocol === 'file:';
}

function updateSearchPath(url, path) {
    let href = url.href.split('?')[0];
    url.href = `${href}?${path}`;
}

function entriesToString(entries) {
    let unserialized = {};
    entries.forEach((entry) => {
        unserialized[entry[0]] = entry[1];
    });
    return serialize(unserialized);
}

class SearchParams {
    constructor(urlRef) {
        internal(this).ref = urlRef;
    }

    get url() {
        return internal(this).ref;
    }

    delete(name) {
        updateSearchPath(
            this.url,
            entriesToString(
                this.entries().filter((entry) => entry[0] !== name)
            )
        );
    }

    entries() {
        let search = this.url.search.substring(1);
        let unserialized = unserialize(search);
        return Object.keys(unserialized)
            .map((key) => [key, unserialized[key]]);
    }

    get(name) {
        let entries = this.entries();
        for (let i = 0, len = entries.length; i < len; i++) {
            if (entries[i][0] === name) {
                return entries[i][1];
            }
        }
    }

    has(name) {
        return !!this.get(name);
    }

    keys() {
        return this.entries()
            .map((entry) => entry[0]);
    }

    set(name, value) {
        this.delete(name);
        let entries = this.entries();
        entries.push([name, value]);
        updateSearchPath(
            this.url,
            entriesToString(entries)
        );
    }

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

    values() {
        return this.entries()
            .map((entry) => entry[1]);
    }
}

export class Url {
    constructor(path, baseUrl) {
        if (baseUrl) {
            this.href = resolve(baseUrl, path);
        } else {
            this.href = path;
        }
        this.searchParams = new SearchParams(this);
    }

    get href() {
        return internal(this).href;
    }

    set href(href) {
        let info = parse(href);
        internal(this).href = href;
        for (let k in info) {
            this[k] = info[k];
        }
    }

    join(...paths) {
        return new Url(join(this.href, ...paths));
    }

    resolve(path) {
        return new Url(resolve(this.href, path));
    }

    isAbsoluteUrl() {
        return isAbsoluteUrl(this.href);
    }

    isDataUrl() {
        return isDataUrl(this.href);
    }

    isLocalUrl() {
        return isLocalUrl(this.href);
    }

    toString() {
        return this.href;
    }
}
