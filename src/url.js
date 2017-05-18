import internal from './internal.js';

export const URL_REGEX = /((?:^(?:[a-z]+:))|^)?(?:\/\/)?([^?\/$]*)([^?]*)?(\?.*)?/i;

const PORT_REGEX = /\:\d*$/;

export function getUrlInfo(url = '') {
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
    if (
        !match ||
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
        let val = decodeURIComponent(chunk[1]);
        if (chunk[0].search('\\[\\]') !== -1) {
            chunk[0] = chunk[0].replace(/\[\]$/, '');
            if (typeof res[chunk[0]] === 'undefined') {
                res[chunk[0]] = [val];

            } else {
                res[chunk[0]].push(val);
            }
        } else {
            res[chunk[0]] = val;
        }
    }

    return res;
}
/**
 * Get a key/value list of search params from an url.
 * @param {string} url The base url.
 * @return {Object} A key/value list of search params.
 */
export function getSearchParams(url) {
    let params = url.split('?').slice(1).join('?');
    return params ? unserialize(params) : {};
}
/**
 * Get a search param value from an url.
 * @param {string} url The base url.
 * @param {string} param The search param name.
 * @return {string} The value for the requested param.
 */
export function getSearchParam(url, param) {
    return getSearchParams(url)[param];
}

export function setSearchParams(url, data) {
    let res = getSearchParams(url);
    for (let k in data) {
        res[k] = data[k];
    }
    res = serialize(res);
    return `${url.split('?')[0]}?${res}`;
}

export function setSearchParam(url, key, value) {
    return setSearchParams(url, { [key]: value });
}

export function unsetSearchParam(url, key) {
    return setSearchParam(url, key, undefined);
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
        let baseInfo = getUrlInfo(base);
        if (!baseInfo.origin) {
            throw new Error('base url is not an absolute url');
        }
        base = baseInfo.origin;
    }
    let stack = base.split('/');
    let parts = relative.split('/').filter((part) => part !== '');
    stack.pop();
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
    return !!getUrlInfo(url).protocol;
}

export function isDataUrl(url) {
    return getUrlInfo(url).protocol === 'data:';
}

export function isLocalUrl(url) {
    return getUrlInfo(url).protocol === 'file:';
}

export class Url {
    constructor(path, baseUrl) {
        if (baseUrl) {
            this.href = resolve(baseUrl, path);
        } else {
            this.href = path;
        }
    }

    get href() {
        return internal(this).href;
    }

    set href(href) {
        let info = getUrlInfo(href);
        internal(this).href = href;
        for (let k in info) {
            this[k] = info[k];
        }
    }

    getSearchParams() {
        return getSearchParams(this.href);
    }

    setSearchParams(params) {
        this.href = setSearchParams(this.href, params);
    }

    getSearchParam(key) {
        return getSearchParam(this.href, key);
    }

    setSearchParam(key, value) {
        this.href = setSearchParam(this.href, key, value);
    }

    join(...paths) {
        return join(this.href, ...paths);
    }

    resolve(path) {
        return resolve(this.href, path);
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
}
