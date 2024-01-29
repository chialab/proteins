"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  Factory: () => factory_exports,
  MixinScope: () => MixinScope,
  Observable: () => Observable,
  Proto: () => proto_exports,
  Symbolic: () => Symbolic,
  Url: () => url_exports,
  clone: () => clone,
  equivalent: () => equivalent,
  has: () => has,
  isArray: () => isArray,
  isBoolean: () => isBoolean,
  isDate: () => isDate,
  isFalsy: () => isFalsy,
  isFunction: () => isFunction,
  isIterable: () => isIterable,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isString: () => isString,
  isUndefined: () => isUndefined,
  keypath: () => keypath_exports,
  merge: () => merge,
  mix: () => mix,
  off: () => off,
  on: () => on,
  pool: () => pool,
  trigger: () => trigger
});
module.exports = __toCommonJS(src_exports);

// src/types.js
function isFunction(obj) {
  return typeof obj === "function";
}
function isString(obj) {
  return typeof obj === "string";
}
function isNumber(obj) {
  return typeof obj === "number" && !isNaN(obj);
}
function isBoolean(obj) {
  return typeof obj === "boolean";
}
function isDate(obj) {
  return obj instanceof Date;
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isUndefined(obj) {
  return typeof obj === "undefined";
}
function isArray(obj) {
  return Array.isArray(obj) || obj instanceof Array;
}
function isFalsy(obj) {
  return isUndefined(obj) || obj === null || obj === false || typeof obj === "number" && isNaN(obj);
}
function isIterable(input) {
  if (input == null || typeof input !== "object") {
    return false;
  }
  return typeof input[Symbol.iterator] === "function";
}

// src/proto.js
var proto_exports = {};
__export(proto_exports, {
  entries: () => entries,
  extend: () => extend,
  get: () => get,
  has: () => has2,
  methods: () => methods,
  properties: () => properties,
  reconstruct: () => reconstruct,
  reduce: () => reduce,
  set: () => set,
  walk: () => walk
});

// src/has.js
function has(scope, property) {
  return Object.prototype.hasOwnProperty.call(scope, property);
}

// src/proto.js
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var create = Object.create;
function walk(Ctr, callback) {
  let proto = Ctr.prototype;
  while (proto) {
    callback(proto);
    proto = Object.getPrototypeOf(proto.constructor).prototype;
  }
}
function entries(Ctr, filter = () => true) {
  const res = {};
  walk(Ctr, (proto) => {
    Object.getOwnPropertyNames(proto).forEach((key) => {
      if (!has(res, key)) {
        const descriptor = getOwnPropertyDescriptor(proto, key);
        if (filter(key, descriptor)) {
          res[key] = descriptor;
        }
      }
    });
  });
  return res;
}
function methods(Ctr) {
  return entries(Ctr, (key, descriptor) => isFunction(descriptor.value) && key !== "constructor");
}
function properties(Ctr) {
  return entries(Ctr, (key, descriptor) => !isFunction(descriptor.value));
}
function reduce(Ctr, property) {
  const res = [];
  walk(Ctr, (proto) => {
    const descriptor = getOwnPropertyDescriptor(proto, property);
    if (descriptor) {
      res.push(descriptor);
    }
  });
  return res;
}
function has2(Ctr, property) {
  return !!reduce(Ctr, property).length;
}
function get(obj) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj);
  }
  if (isObject(obj.__proto__)) {
    return obj.__proto__;
  }
  return obj.constructor.prototype;
}
function set(obj, proto) {
  if (!isFunction(obj) && isFunction(proto)) {
    proto = proto.prototype;
  }
  Object.setPrototypeOf ? Object.setPrototypeOf(obj, proto) : obj.__proto__ = proto;
}
function extend(proto1, proto2) {
  if (isFunction(proto1)) {
    proto1 = proto1.prototype;
  }
  if (isFunction(proto2)) {
    proto2 = proto2.prototype;
  }
  return create(proto1, proto2);
}
function reconstruct(Ctr) {
  if (isFunction(Ctr)) {
    return reconstruct(Ctr.prototype);
  } else if (isArray(Ctr)) {
    const res = [];
    set(res, Ctr);
    return res;
  }
  return create(Ctr);
}

// src/_helpers.js
function getDescriptors(obj) {
  return Object.getOwnPropertyNames(obj).reduce((acc, propName) => {
    acc[propName] = Object.getOwnPropertyDescriptor(obj, propName);
    return acc;
  }, {});
}
function buildDescriptor(descriptor, val, writable = true) {
  const newDescriptor = {
    configurable: true,
    enumerable: descriptor.enumerable
  };
  if (descriptor.get || descriptor.set) {
    newDescriptor.get = descriptor.get;
    newDescriptor.set = descriptor.set;
  } else {
    newDescriptor.value = val;
    newDescriptor.writable = writable;
  }
  return newDescriptor;
}
var entries2 = Object.entries || ((obj) => Object.keys(obj).map((key) => [key, obj[key]]));
var flat = Array.prototype.flat || function() {
  return this.reduce((acc, item) => {
    if (isArray(item)) {
      return acc.concat(flat.call(item));
    }
    return acc.concat([item]);
  }, []);
};

// src/clone.js
function noop(scope, key, prop) {
  return prop;
}
function clone(obj, callback = noop, useStrict = false, cache = /* @__PURE__ */ new WeakMap()) {
  if (typeof callback === "boolean") {
    useStrict = callback;
    callback = noop;
  }
  if (isObject(obj) || isArray(obj)) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    const res = reconstruct(get(obj));
    cache.set(obj, res);
    const newDescriptors = getDescriptors(res);
    const descriptors = getDescriptors(obj);
    for (const key in descriptors) {
      const descriptor = descriptors[key];
      if (newDescriptors[key] && !newDescriptors[key].configurable) {
        continue;
      }
      let value;
      if ("value" in descriptor) {
        value = callback(obj, key, clone(descriptor.value, callback, useStrict, cache));
      }
      Object.defineProperty(res, key, buildDescriptor(descriptor, value, useStrict ? descriptor.writable : true));
    }
    if (useStrict) {
      if (Object.isFrozen(obj)) {
        Object.freeze(res);
      } else if (Object.isSealed(obj)) {
        Object.seal(res);
      }
    }
    return res;
  } else if (isDate(obj)) {
    return new Date(obj.getTime());
  } else if (isFunction(obj)) {
    return obj;
  }
  return obj;
}

// src/merge.js
var defaults = {
  mergeObjects: true,
  joinArrays: false,
  strictMerge: false
};
function merge(...objects) {
  let options = defaults;
  if (typeof this !== "undefined" && this.options) {
    options = this.options;
  }
  const first = objects.shift();
  const res = clone(first);
  objects.forEach((obj2) => {
    if (isObject(first) && isObject(obj2)) {
      const descriptors = getDescriptors(obj2);
      Object.keys(descriptors).forEach((key) => {
        const leftDescriptor = Object.getOwnPropertyDescriptor(first, key);
        const rightDescriptor = descriptors[key];
        if (!("value" in rightDescriptor)) {
          Object.defineProperty(res, key, buildDescriptor(rightDescriptor));
          return;
        }
        if (options.strictMerge) {
          if (!leftDescriptor) {
            return;
          }
          if (typeof leftDescriptor.get !== typeof rightDescriptor.get) {
            return;
          }
          if (typeof leftDescriptor.set !== typeof rightDescriptor.set) {
            return;
          }
        }
        let rightVal = clone(rightDescriptor.value);
        if (leftDescriptor && rightVal) {
          const leftVal = leftDescriptor.value;
          if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
            rightVal = merge.call(this, leftVal, rightVal);
          } else if (isArray(leftVal) && isArray(rightVal) && options.joinArrays) {
            rightVal = merge.call(this, leftVal, rightVal);
          }
        }
        Object.defineProperty(res, key, buildDescriptor(rightDescriptor, rightVal));
      });
    } else if (isArray(first) && isArray(obj2)) {
      const descriptors = getDescriptors(obj2);
      delete descriptors.length;
      Object.keys(descriptors).forEach((key) => {
        const rightDescriptor = descriptors[key];
        if (!("value" in rightDescriptor)) {
          Object.defineProperty(res, key, buildDescriptor(rightDescriptor));
          return;
        }
        const leftVal = first[key];
        let rightVal = clone(rightDescriptor.value);
        if (!isNaN(key)) {
          if (options.joinArrays) {
            if (first.indexOf(rightVal) === -1) {
              res.push(rightVal);
            }
            return;
          }
          if (isObject(leftVal) && isObject(rightVal) && options.mergeObjects) {
            rightVal = merge.call(this, leftVal, rightVal);
          } else if (isArray(leftVal) && isArray(rightVal)) {
            rightVal = merge.call(this, leftVal, rightVal);
          }
        }
        Object.defineProperty(res, key, buildDescriptor(rightDescriptor, rightVal));
      });
    } else {
      throw "incompatible types";
    }
  });
  return res;
}
merge.config = function(options = {}) {
  return (...args) => merge.call({
    options: merge(defaults, options)
  }, ...args);
};

// src/equivalent.js
function internalEquivalent(obj1, obj2, processing = []) {
  if (typeof obj1 === typeof obj2) {
    if (isArray(obj1)) {
      if (obj1.length === obj2.length) {
        for (let i = 0, len = obj1.length; i < len; i++) {
          if (!internalEquivalent(obj1[i], obj2[i], processing)) {
            return false;
          }
        }
        return true;
      }
      return false;
    } else if (isObject(obj1)) {
      let processSourceIndex = processing.indexOf(obj1);
      while (processSourceIndex !== -1) {
        if (processSourceIndex % 2 === 0 && processing[processSourceIndex + 1] === obj2) {
          return true;
        }
        processSourceIndex = processing.indexOf(obj1, processSourceIndex);
      }
      processing.push(obj1, obj2);
      const sourceKeys = Object.keys(obj1).sort();
      const targetKeys = Object.keys(obj2).sort();
      if (internalEquivalent(sourceKeys, targetKeys)) {
        for (let i = 0, len = sourceKeys.length; i < len; i++) {
          const key = sourceKeys[i];
          if (!internalEquivalent(obj1[key], obj2[key], processing)) {
            return false;
          }
        }
        return true;
      }
      return false;
    } else if (isDate(obj1) && isDate(obj2)) {
      return obj1.getTime() === obj2.getTime();
    } else if (isFunction(obj1.valueOf) && isFunction(obj2.valueOf)) {
      return obj1.valueOf() === obj2.valueOf();
    }
    return obj1 === obj2;
  }
  return false;
}
function equivalent(obj1, obj2) {
  return internalEquivalent(obj1, obj2);
}

// src/symbolic.js
var support = typeof Symbol === "function";
var registry = [];
var SymbolPolyfill = class {
  constructor(property) {
    const sym = this.SYM = `__${property}_${registry.length}`;
    registry.push(sym);
    Object.defineProperty(Object.prototype, sym, {
      configurable: true,
      enumerable: false,
      set(x) {
        Object.defineProperty(this, sym, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: x
        });
      }
    });
  }
  toString() {
    return this.SYM;
  }
};
function Symbolic(property) {
  if (support) {
    const sym = Symbol(property);
    registry.push(sym);
    return sym;
  }
  return new SymbolPolyfill(property);
}
Symbolic.isSymbolic = function(sym) {
  if (!sym) {
    return false;
  }
  if (sym instanceof SymbolPolyfill) {
    sym = sym.toString();
  }
  return registry.indexOf(sym) !== -1;
};

// src/mixin.js
var MIXINS_SYM = Symbolic("mixins");
function mix(SuperClass) {
  return new MixinScope(SuperClass);
}
var MixinScope = class {
  /**
   * Create a mixable class.
   * @param {Function} superClass The class to extend.
   */
  constructor(superClass) {
    this.superClass = superClass || class {
    };
  }
  /**
   * Mix the super class with a list of mixins.
   *
   * @param {...Function} mixins *N* mixin functions.
   * @return {*} The extended class.
   */
  with(...mixins) {
    let Class = this.superClass;
    mixins.forEach((mixin) => {
      if (!this.has(mixin)) {
        Class = mixin(Class);
      }
    });
    Class[MIXINS_SYM] = has(Class, MIXINS_SYM) ? Class[MIXINS_SYM] : [];
    Class[MIXINS_SYM].push(...mixins);
    return Class;
  }
  /**
   * Check if the SuperClass has been already mixed with a mixin function.
   *
   * @param {Function} mixin The mixin function.
   * @return {Boolean}
   */
  has(mixin) {
    let Class = this.superClass;
    while (Class && Class !== Object) {
      const attached = Class[MIXINS_SYM] || [];
      if (attached.indexOf(mixin) !== -1) {
        return true;
      }
      Class = Object.getPrototypeOf(Class);
    }
    return false;
  }
};

// src/factory.js
var factory_exports = {};
__export(factory_exports, {
  BaseFactory: () => BaseFactory,
  CONFIG_SYM: () => CONFIG_SYM,
  CONTEXT_SYM: () => CONTEXT_SYM,
  Configurable: () => Configurable,
  ConfigurableMixin: () => ConfigurableMixin,
  Emitter: () => Emitter,
  EmitterMixin: () => EmitterMixin,
  Factory: () => Factory,
  FactoryMixin: () => FactoryMixin,
  InjectableMixin: () => InjectableMixin,
  LISTENERS_SYM: () => LISTENERS_SYM
});

// src/keypath.js
var keypath_exports = {};
__export(keypath_exports, {
  del: () => del,
  empty: () => empty,
  ensure: () => ensure,
  get: () => get2,
  has: () => has3,
  insert: () => insert,
  set: () => set2
});
function assertObject(obj) {
  return !isFalsy(obj) && typeof obj === "object";
}
function assertArgs(obj, path) {
  if (!assertObject(obj)) {
    throw new Error("invalid scope");
  }
  if (isFalsy(path) || isArray(path) && path.length === 0) {
    throw new Error("invalid path");
  }
}
function pathToArray(path) {
  if (isString(path)) {
    return path.split(".");
  }
  if (isNumber(path)) {
    return [`${path}`];
  }
  if (isArray(path)) {
    return path.slice(0);
  }
  return path;
}
function get2(obj, path, defaultValue) {
  assertArgs(obj, path);
  if (!has3(obj, path)) {
    return defaultValue;
  }
  let value = obj;
  path = pathToArray(path);
  path.forEach((prop) => {
    value = value[prop];
  });
  return value;
}
function set2(obj, path, value, ensure2 = true) {
  assertArgs(obj, path);
  path = pathToArray(path);
  if (path.length === 1) {
    if (isArray(obj) && path[0] === "") {
      obj.push(value);
    } else {
      obj[path[0]] = value;
    }
    return value;
  }
  const current = path.shift();
  let currentObj;
  if (!has(obj, current)) {
    if (ensure2) {
      const next = path[0];
      if (isNaN(next) && next !== "") {
        currentObj = obj[current] = {};
      } else {
        currentObj = obj[current] = [];
      }
    }
  } else {
    currentObj = obj[current];
  }
  return set2(currentObj, path, value, ensure2);
}
function has3(obj, path) {
  if (!assertObject(obj)) {
    return false;
  }
  assertArgs(obj, path);
  path = pathToArray(path);
  let current = path.shift();
  if (isArray(obj) && !isNaN(current)) {
    current = parseInt(current);
    if (obj.length > current) {
      if (path.length === 0) {
        return true;
      }
      return has3(obj[current], path);
    }
  }
  if (current in obj || has(obj, current)) {
    if (path.length === 0) {
      return true;
    }
    return has3(obj[current], path);
  }
  return false;
}
function ensure(obj, path, value) {
  const val = get2(obj, path);
  if (!val) {
    set2(obj, path, value);
  }
  return val;
}
function insert(obj, path, value, index) {
  assertArgs(obj, path);
  path = pathToArray(path);
  let arr = [];
  arr = ensure(obj, path, arr) || arr;
  if (isArray(arr)) {
    if (!isFalsy(index)) {
      arr.splice(index, 0, value);
    } else {
      arr.push(value);
    }
  }
  return arr;
}
function empty(obj, path) {
  assertArgs(obj, path);
  path = pathToArray(path);
  let parent = obj;
  if (path.length > 1) {
    parent = get2(obj, path.slice(0, -1));
  }
  const current = path[path.length - 1];
  if (parent && has(parent, current)) {
    const arr = parent[current];
    if (isArray(arr)) {
      arr.splice(0, arr.length);
    } else if (isObject(arr)) {
      for (const k in arr) {
        delete arr[k];
      }
    } else if (isString(arr)) {
      parent[current] = "";
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
}
function del(obj, path) {
  assertArgs(obj, path);
  path = pathToArray(path);
  const pathToDelete = path.pop();
  let subObj = obj;
  if (path.length) {
    subObj = get2(obj, path);
  }
  if (isObject(subObj)) {
    delete subObj[pathToDelete];
  } else if (isArray(subObj) && !isNaN(pathToDelete)) {
    subObj.splice(pathToDelete, 1);
  }
  return subObj;
}

// src/events.js
var SYM = Symbolic("listeners");
function on(scope, name, callback) {
  if (!isFunction(callback)) {
    throw new TypeError("callback is not a function");
  }
  scope[SYM] = scope[SYM] || {};
  const callbacks = scope[SYM];
  const evtCallbacks = callbacks[name] = callbacks[name] || [];
  evtCallbacks.push(callback);
  return off.bind(null, scope, name, callback);
}
function off(scope, name, callback) {
  if (callback) {
    const callbacks = scope[SYM];
    if (callbacks) {
      const evtCallbacks = callbacks[name] = callbacks[name] || [];
      const io = evtCallbacks.indexOf(callback);
      if (io !== -1) {
        evtCallbacks.splice(io, 1);
      }
    }
  } else if (name) {
    const callbacks = scope[SYM];
    if (callbacks) {
      delete callbacks[name];
    }
  } else {
    scope[SYM] = {};
  }
}
function trigger(scope, name, ...args) {
  const callbacksList = has(scope, SYM) && has(scope[SYM], name) && scope[SYM][name] || [];
  const finalResults = callbacksList.slice(0).reduce((results, callback) => {
    if (callbacksList.indexOf(callback) === -1) {
      return results;
    }
    const lastResult = results[results.length - 1];
    let result;
    if (lastResult instanceof Promise) {
      result = lastResult.then(() => callback.call(scope, ...args));
    } else {
      result = callback.call(scope, ...args);
    }
    results.push(result);
    return results;
  }, []);
  return Promise.all(finalResults);
}

// src/factory.js
var FACTORY_SYM = Symbolic("fsymbol");
var CONTEXT_SYM = Symbolic("context");
var CONFIG_SYM = Symbolic("config");
var LISTENERS_SYM = Symbolic("listeners");
var context;
var FACTORY_SYMBOLS = {};
var FactoryMixin = (SuperClass) => class BaseFactory extends SuperClass {
  /**
   * A symbolic defintion for the Factory constructor.
   * @type {Symbolic}
   */
  static get SYM() {
    if (!has(this, FACTORY_SYM)) {
      const sym = Symbolic(this.name);
      FACTORY_SYMBOLS[sym] = this;
      this[FACTORY_SYM] = sym;
    }
    return this[FACTORY_SYM];
  }
  constructor(...args) {
    super(...args);
    this.initialize(...args);
  }
  /**
   * @param {...*} [args] Arguments for super initialize.
   */
  initialize(...args) {
    if (!this[CONTEXT_SYM]) {
      this[CONTEXT_SYM] = context || this;
    }
    return has2(SuperClass, "initialize") && super.initialize(...args);
  }
  /**
   * Init a new Factory with the same context.
   *
   * @param {Function} Factory The Factory constructor.
   * @param {...*} args A list of arguments for the constructor.
   * @return {Object} The new instance.
   */
  init(Factory2, ...args) {
    context = this[CONTEXT_SYM];
    const res = new Factory2(...args);
    context = null;
    return res;
  }
  /**
   * Clear the context.
   */
  destroy() {
    delete this[CONTEXT_SYM];
    return has2(SuperClass, "destroy") && super.destroy();
  }
};
var EmitterMixin = (SuperClass) => class Emitter extends mix(SuperClass).with(FactoryMixin) {
  /**
   * @param {...*} [args] Arguments for the constructor.
   */
  initialize(...args) {
    super.initialize(...args);
    if (!this[LISTENERS_SYM]) {
      this[LISTENERS_SYM] = [];
    }
  }
  /**
   * Add an event listener.
   *
   * @param {string} name The event name.
   * @param {Function} callback The callback to exec for the event.
   * @return {Function} A listener destroyer.
   */
  on(name, callback) {
    return on(this, name, callback);
  }
  /**
   * Remove an event(s) listener(s).
   *
   * @param {string} [name] The event name.
   * @param {Function} [callback] The optional callback to remove.
   */
  off(name, callback) {
    return off(this, name, callback);
  }
  /**
   * Dispatch an event.
   *
   * @param {string} name The event name.
   * @param {...*} args A list of arguments to pass to listeners.
   * @return {Promise} It resolves when all listeners have been triggered.
   */
  trigger(name, ...args) {
    return trigger(this, name, ...args);
  }
  /**
   * Listen events from another object.
   *
   * @param {Object} obj The object to listen.
   * @param {string} name The event name.
   * @param {Function} callback The callback to exec for the event.
   * @return {Function} A listener destroyer.
   */
  listen(obj, name, callback) {
    const destroyer = on(obj, name, callback);
    this[LISTENERS_SYM].push(destroyer);
    return destroyer;
  }
  /**
   * Unlisten event(s) from another object(s).
   *
   * @param {Object} [obj] The object to unlisten.
   * @param {string} [name] The event name.
   * @param {Function} [callback] The callback to exec for the event.
   * @return {Function} A listener destroyer.
   */
  unlisten(obj, name, callback) {
    if (obj) {
      off(obj, name, callback);
    } else {
      this[LISTENERS_SYM].forEach((offListener) => offListener());
      this[LISTENERS_SYM] = [];
    }
  }
  /**
   * Clear all listeners.
   */
  destroy() {
    this.off();
    this.unlisten();
    return super.destroy();
  }
};
var ConfigurableMixin = (SuperClass) => class Configurable extends mix(SuperClass).with(FactoryMixin) {
  /**
   * @param {Object} [config] The instance configuration object.
   * @param {...*} [args] Other arguments for the super constructor.
   */
  initialize(config, ...args) {
    super.initialize(config, ...args);
    if (!this[CONFIG_SYM]) {
      this[CONFIG_SYM] = clone(this.defaultConfig || {});
      if (config) {
        this.config(config);
      }
    }
  }
  /**
   * Default config object.
   */
  get defaultConfig() {
    return {};
  }
  /**
   * Update instance configuration.
   *
   * @param {Object|string} config The configuration to update (or the path of the configuration property).
   * @param {*} [value] The value to update for the given config name.
   * @return {Object} Final configuration of the instance.
   */
  config(config, ...args) {
    let current = this[CONFIG_SYM];
    if (args.length === 0 && isString(config)) {
      return get2(current, config);
    }
    const value = args[0];
    if (isString(config)) {
      const oldValue = get2(current, config);
      if (oldValue !== value) {
        set2(current, config, value);
        this.trigger("config:changed", config, oldValue, value);
      }
    }
    if (isObject(config)) {
      current = merge(current, config);
    }
    this[CONFIG_SYM] = current;
    return current;
  }
  /**
   * Clear the configuration.
   */
  destroy() {
    delete this[CONFIG_SYM];
    return super.destroy();
  }
};
var InjectableMixin = (SuperClass) => class Factory extends mix(SuperClass).with(FactoryMixin) {
  /**
   * @param {...*} [args] Arguments for the constructor.
   */
  initialize(...args) {
    super.initialize(...args);
    const ctx = this[CONTEXT_SYM];
    this.inject.forEach((Injector) => {
      if (Symbolic.isSymbolic(Injector)) {
        Injector = FACTORY_SYMBOLS[Injector];
      }
      if (!this[Injector.SYM]) {
        if (ctx) {
          this[Injector.SYM] = ctx[Injector.SYM] = ctx[Injector.SYM] || this.init(Injector);
        } else {
          this[Injector.SYM] = this.init(Injector);
        }
      }
    });
  }
  /**
   * A default list of injections.
   */
  get inject() {
    return [];
  }
  /**
   * Clear injected methods.
   */
  destroy() {
    this.inject.forEach((Injector) => {
      const SYM2 = Symbolic.isSymbolic(Injector) ? Injector : Injector.SYM;
      delete this[SYM2];
    });
    return super.destroy();
  }
};
var BaseFactory = class extends mix().with(FactoryMixin) {
};
var Emitter = class extends mix().with(EmitterMixin) {
};
var Configurable = class extends mix().with(ConfigurableMixin) {
};
var Factory = class extends mix().with(EmitterMixin, ConfigurableMixin, InjectableMixin) {
};

// src/observable.js
var OBSERVABLE_SYM = Symbolic("observable");
var ARRAY_PROTO = Array.prototype;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var ProxyHelper = typeof Proxy !== "undefined" ? Proxy : class {
  constructor(data, handler2) {
    const res = reconstruct(get(data));
    Object.keys(data).filter((key) => Object.getOwnPropertyDescriptor(data, key).configurable).forEach((key) => {
      this.define(res, data, key, handler2);
    });
    if (isArray(data)) {
      let lastLength = data.length;
      res.on("change", () => {
        if (data.length !== lastLength) {
          Object.keys(data).forEach((key) => {
            if (key !== OBSERVABLE_SYM) {
              this.define(res, data, key, handler2);
            }
          });
          lastLength = data.length;
        }
      });
    }
    res[OBSERVABLE_SYM] = data[OBSERVABLE_SYM];
    return res;
  }
  define(res, data, property, handler2) {
    const desc = {
      configurable: true,
      enumerable: "enumerable" in handler2 ? handler2.enumerable : !Symbolic.isSymbolic(property)
    };
    if (handler2.get) {
      desc.get = () => handler2.get(data, property);
    }
    if (handler2.set) {
      desc.set = (val) => handler2.set(data, property, val);
    }
    Object.defineProperty(res, property, desc);
  }
};
function triggerChanges(scope, changeset) {
  return scope[OBSERVABLE_SYM].trigger("change", changeset);
}
var ARRAY_PROTO_WRAP = {
  push(...items) {
    const length = this.length;
    items = items.map(
      (item, index) => subobserve(this, length + index, item)
    );
    const res = ARRAY_PROTO.push.call(this, ...items);
    triggerChanges(this, {
      property: length,
      added: items,
      removed: []
    });
    return res;
  },
  unshift(item) {
    const res = ARRAY_PROTO.unshift.call(this, item);
    subobserve(this, 0, item);
    triggerChanges(this, {
      property: 0,
      added: [item],
      removed: []
    });
    return res;
  },
  pop() {
    const res = ARRAY_PROTO.pop.call(this);
    triggerChanges(this, {
      property: this.length,
      added: [],
      removed: [res]
    });
    return res;
  },
  shift() {
    const res = ARRAY_PROTO.shift.call(this);
    triggerChanges(this, {
      property: 0,
      added: [],
      removed: [res]
    });
    return res;
  },
  splice(index, count, ...items) {
    items = items.map(
      (item, index2) => subobserve(this, this.length + index2, item)
    );
    const res = ARRAY_PROTO.splice.call(this, index, count, ...items);
    triggerChanges(this, {
      property: index,
      added: items,
      removed: [res]
    });
    return res;
  }
};
function subobserve(target, name, value) {
  if (isObject(value) || isArray(value)) {
    value = new Observable(value);
    value.on("change", (changeset) => {
      name = isArray(target) ? target.indexOf(value) : name;
      const changes = {
        property: `${name}.${changeset.property}`
      };
      if (hasOwnProperty.call(changeset, "value")) {
        changes.oldValue = changeset.oldValue;
        changes.value = changeset.value;
      } else if (hasOwnProperty.call(changeset, "added")) {
        changes.added = changeset.added;
        changes.removed = changeset.removed;
      }
      triggerChanges(target, changes);
    });
  }
  return value;
}
var handler = {
  getPrototypeOf(target) {
    if (isArray(target)) {
      return target.constructor.prototype;
    }
    return Reflect.getPrototypeOf(target);
  },
  get: (target, name) => target[name],
  set: (target, name, value) => {
    if (Symbolic.isSymbolic(name)) {
      return target[name] = value;
    }
    const oldValue = target[name];
    if (target[name] !== value) {
      value = subobserve(target, name, value);
      target[name] = value;
      triggerChanges(target, {
        property: name,
        oldValue,
        value
      });
    }
    return true;
  }
};
var Observable = class _Observable {
  constructor(data) {
    if (typeof data !== "object") {
      throw new Error("Cannot observe this value.");
    }
    const emitter = data[OBSERVABLE_SYM] || new Emitter();
    if (emitter.proxy) {
      return emitter.proxy;
    }
    const proto = {
      on: { value: emitter.on.bind(emitter) },
      off: { value: emitter.off.bind(emitter) },
      trigger: { value: emitter.trigger.bind(emitter) }
    };
    if (isArray(data)) {
      proto.push = { get: () => ARRAY_PROTO_WRAP.push.bind(data) };
      proto.unshift = { get: () => ARRAY_PROTO_WRAP.unshift.bind(data) };
      proto.pop = { get: () => ARRAY_PROTO_WRAP.pop.bind(data) };
      proto.shift = { get: () => ARRAY_PROTO_WRAP.shift.bind(data) };
      proto.splice = { get: () => ARRAY_PROTO_WRAP.splice.bind(data) };
    }
    data[OBSERVABLE_SYM] = emitter;
    set(data, extend(get(data), proto));
    emitter.proxy = new ProxyHelper(data, handler);
    Object.keys(data).forEach((key) => {
      if (key !== OBSERVABLE_SYM) {
        data[key] = subobserve(data, key, data[key]);
      }
    });
    return emitter.proxy;
  }
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
  static reobserve(data) {
    if (typeof Proxy !== "undefined") {
      return;
    }
    new _Observable(data);
    Object.keys(data).forEach((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(data, key);
      if (key !== OBSERVABLE_SYM && descriptor && descriptor.configurable && "value" in descriptor) {
        data[key] = subobserve(data, key, data[key]);
        triggerChanges(data, {
          property: key,
          oldValue: void 0,
          value: data[key]
        });
      }
    });
  }
};

// src/url.js
var url_exports = {};
__export(url_exports, {
  SearchParams: () => SearchParams,
  Url: () => Url,
  isAbsoluteUrl: () => isAbsoluteUrl,
  isDataUrl: () => isDataUrl,
  isLocalUrl: () => isLocalUrl,
  join: () => join,
  parse: () => parse,
  resolve: () => resolve,
  serialize: () => serialize,
  unserialize: () => unserialize
});
var REF_SYM = Symbolic("ref");
var URL_REGEX = /((?:^(?:[a-z]+:))|^)?(?:\/\/)?([^?/$]*)([^?]*)?(\?.*)?/i;
var PORT_REGEX = /:\d*$/;
function parse(url = "") {
  const hashSplit = url.split("#");
  const hash = hashSplit.length > 1 ? hashSplit.pop() : void 0;
  url = hashSplit.join("#");
  const match = url.match(URL_REGEX);
  const res = {
    host: void 0,
    hostname: void 0,
    port: void 0,
    username: void 0,
    password: void 0,
    hash
  };
  if (match) {
    res.protocol = match[1];
    if (match[2]) {
      let host = match[2];
      res.host = host;
      const port = host.match(PORT_REGEX);
      if (port) {
        res.port = port[0].substring(1);
        host = host.replace(port[0], "");
      }
      const authSplit = host.split("@");
      res.hostname = authSplit.pop();
      const authChunk = authSplit.join("@").split(":");
      res.username = authChunk.shift();
      res.password = authChunk.join(":");
    }
    res.pathname = match[3];
    res.search = match[4];
  }
  if (!match || res.port && !res.hostname || res.protocol && res.protocol !== "file:" && !res.hostname || res.search && !res.hostname && !res.pathname || res.password && !res.username) {
    throw new SyntaxError("invalid url");
  }
  if (res.host && res.pathname === "/") {
    res.pathname = "";
  }
  if (res.hostname) {
    let origin = res.protocol ? `${res.protocol}//` : "";
    origin += res.hostname;
    origin += res.port ? `:${res.port}` : "";
    res.origin = origin;
  }
  return res;
}
function chunk(key, val) {
  if (val) {
    return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
  }
  return `${encodeURIComponent(key)}`;
}
function serialize(searchParams, prefix, chunkFn = chunk) {
  const str = [];
  const entries3 = isIterable(searchParams) && !isArray(searchParams) ? searchParams : entries2(searchParams);
  for (const [propertyKey, value] of entries3) {
    if (value == null) {
      continue;
    }
    const key = prefix ? `${prefix}[${propertyKey}]` : propertyKey;
    let serialized = value;
    if (value instanceof Date) {
      serialized = value.toISOString();
    }
    if (typeof serialized === "object") {
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
  return str.join("&");
}
function unserialize(str) {
  str = decodeURI(str);
  const chunks = str.split("&");
  const res = {};
  for (let i = 0, len = chunks.length; i < len; i++) {
    const chunk2 = chunks[i].split("=");
    if (chunk2[0] && chunk2[1]) {
      const key = chunk2[0].replace(/\[(.*?)\]/g, ".$1");
      const val = decodeURIComponent(chunk2[1]);
      set2(res, key, val);
    }
  }
  return res;
}
function join(...paths) {
  return paths.map((path) => (path || "").replace(/^\/*/, "").replace(/\/*$/, "")).filter((path) => !!path).join("/");
}
function resolve(base, relative) {
  if (relative[0] === "/") {
    const baseInfo = parse(base);
    if (!baseInfo.origin) {
      throw new Error("base url is not an absolute url");
    }
    base = `${baseInfo.origin}/`;
  }
  const stack = base.split("/");
  const parts = relative.split("/").filter((part) => part !== "");
  if (stack.length > 1) {
    stack.pop();
  }
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === ".") {
      continue;
    } else if (parts[i] === "..") {
      stack.pop();
    } else {
      stack.push(parts[i]);
    }
  }
  return stack.join("/");
}
function isAbsoluteUrl(url) {
  return !!parse(url).protocol;
}
function isDataUrl(url) {
  return parse(url).protocol === "data:";
}
function isLocalUrl(url) {
  return parse(url).protocol === "file:";
}
function updateSearchPath(url, path) {
  const href = url.href.split("?")[0];
  if (!path) {
    return url.href = href;
  }
  return url.href = `${href}?${path}`;
}
function entriesToString(entries3) {
  const unserialized = {};
  entries3.forEach((entry) => {
    unserialized[entry[0]] = entry[1];
  });
  return serialize(unserialized);
}
var SearchParams = class {
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
    return this.entries().map((entry) => entry[0]);
  }
  /**
   * List all entry values.
   *
   * @return {Array} Entry values list.
   */
  values() {
    return this.entries().map((entry) => entry[1]);
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
    return Object.keys(unserialized).map((key) => [key, unserialized[key]]);
  }
  /**
   * Retrieve an entry.
   *
   * @param {string} name The entity name to get.
   * @return {*} The entity value.
   */
  get(name) {
    const entries3 = this.entries();
    for (let i = 0, len = entries3.length; i < len; i++) {
      if (entries3[i][0] === name) {
        return entries3[i][1];
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
    const entries3 = this.entries();
    entries3.push([name, value]);
    updateSearchPath(
      this.url,
      entriesToString(entries3)
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
    const entries3 = this.entries();
    entries3.sort((entry1, entry2) => {
      const key1 = entry1[0];
      const key2 = entry2[0];
      if (key1 < key2) {
        return -1;
      } else if (key1 > key2) {
        return 1;
      }
      return 0;
    });
    updateSearchPath(this.url, entriesToString(entries3));
  }
  toString() {
    return this.url.search;
  }
};
var Url = class _Url {
  /**
   * Create a Url instance.
   * @param {string} path The url to handle.
   * @param {string} [baseUrl] The optional base url.
   */
  constructor(path, baseUrl) {
    this.protocol = void 0;
    this.username = void 0;
    this.password = void 0;
    this.host = void 0;
    this.hostname = void 0;
    this.pathname = void 0;
    this.port = void 0;
    this.search = void 0;
    this.hash = void 0;
    this.href = baseUrl ? resolve(baseUrl, path) : path;
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
    return new _Url(join(this.href, ...paths));
  }
  /**
   * Resolve a path relative to the current Url.
   *
   * @param {string} path The relative path.
   * @return {Url} A new url instance.
   */
  resolve(path) {
    return new _Url(resolve(this.href, path));
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
};

// src/pool.js
function pool(workers, promiseFactories) {
  if (workers < 1) {
    throw new Error("Number of workers must be positive");
  }
  const iterator = indexedIterator(promiseFactories);
  const promises = [];
  for (let i = 0; i < workers; i++) {
    promises.push(worker(iterator));
  }
  return Promise.all(promises).then(
    (results) => flat.call(results).sort((a, b) => a.index - b.index).map(({ result }) => result)
  );
}
function worker(iterator, results = []) {
  const next = iterator.next();
  if (next.done) {
    return Promise.resolve(results);
  }
  const { index, value } = next.value;
  return value().then((result) => {
    results.push({ index, result });
    return worker(iterator, results);
  });
}
function* indexedIterator(it) {
  let index = 0;
  for (const value of it) {
    yield { index: index++, value };
  }
}
//# sourceMappingURL=proteins.cjs.map
