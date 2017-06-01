import {
    isNumber,
    isString,
    isBoolean,
    isObject,
    isArray,
    isFalsy,
} from './types.js';

function assertObject(obj) {
    return isArray(obj) || isObject(obj);
}

function assertArgs(obj, path) {
    if (!assertObject(obj)) {
        throw new Error('invalid scope');
    }
    if (isFalsy(path) || (isArray(path) && path.length === 0)) {
        throw new Error('invalid path');
    }
}

function pathToArray(path) {
    if (isString(path)) {
        return path.split('.');
    }
    if (isNumber(path)) {
        return [`${path}`];
    }
    if (isArray(path)) {
        return path.slice(0);
    }
    return path;
}

export default function keypath(obj, path, ...args) {
    assertArgs(obj, path);
    path = pathToArray(path);
    if (args.length) {
        let value = args[0];
        let ensure = args.length > 1 ? args[1] : true;
        if (path.length === 1) {
            if (isArray(obj) && path[0] === '') {
                obj.push(value);
            } else {
                obj[path[0]] = value;
            }
            return value;
        }
        let current = path.shift();
        let currentObj;
        if (!obj.hasOwnProperty(current)) {
            if (ensure) {
                let next = path[0];
                if (isNaN(next) && next !== '') {
                    currentObj = obj[current] = {};
                } else {
                    currentObj = obj[current] = [];
                }
            }
        } else {
            currentObj = obj[current];
        }
        return keypath(currentObj, path, ...args);
    } else {
        let current = path.shift();
        let currentObj = obj[current];
        if (path.length === 0) {
            return currentObj;
        }
        if (!assertObject(currentObj)) {
            return undefined;
        }
        return keypath(currentObj, path);
    }
}

keypath.has = (obj, path) => {
    if (!assertObject(obj)) {
        return false;
    }
    assertArgs(obj, path);
    path = pathToArray(path);
    let current = path.shift();
    if (isObject(obj)) {
        if (obj.hasOwnProperty(current)) {
            if (path.length === 0) {
                return true;
            }
            return keypath.has(obj[current], path);
        }
    }
    if (isArray(obj) && !isNaN(current)) {
        current = parseInt(current);
        if (obj.length > current) {
            if (path.length === 0) {
                return true;
            }
            return keypath.has(obj[current], path);
        }
    }
    return false;
};

keypath.ensure = (obj, path, value) => {
    let val = keypath(obj, path);
    if (!val) {
        keypath(obj, path, value);
    }
    return val;
};

keypath.insert = (obj, path, value, index) => {
    assertArgs(obj, path);
    path = pathToArray(path);
    let arr = [];
    arr = keypath.ensure(obj, path, arr) || arr;
    if (isArray(arr)) {
        if (!isFalsy(index)) {
            arr.splice(index, 0, value);
        } else {
            arr.push(value);
        }
    }
    return arr;
};

keypath.empty = (obj, path) => {
    assertArgs(obj, path);
    path = pathToArray(path);
    let parent = obj;
    if (path.length > 1) {
        parent = keypath(obj, path.slice(0, -1));
    }
    let current = path[path.length - 1];
    if (parent && parent.hasOwnProperty(current)) {
        let arr = parent[current];
        if (isArray(arr)) {
            arr.splice(0, arr.length);
        } else if (isObject(arr)) {
            for (let k in arr) {
                delete arr[k];
            }
        } else if (isString(arr)) {
            parent[current] = '';
        } else if (isNumber(arr)) {
            parent[current] = 0;
        } else if (isBoolean(arr)) {
            parent[current] = false;
        } else {
            parent[current] = null;
        }
        return arr;
    }
    return null;
};

keypath.del = (obj, path) => {
    assertArgs(obj, path);
    path = pathToArray(path);
    let pathToDelete = path.pop();
    let subObj = obj;
    if (path.length) {
        subObj = keypath(obj, path);
    }
    if (isObject(subObj)) {
        delete subObj[pathToDelete];
    } else if (isArray(subObj) && !isNaN(pathToDelete)) {
        subObj.splice(pathToDelete, 1);
    }
    return subObj;
};
