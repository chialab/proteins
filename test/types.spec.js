/* eslint-env mocha */
import { isObject, isDate, isNumber, isString, isBoolean, isFunction, isUndefined, isFalsy } from '../src/types.js';
import chai from 'chai/chai';

const { assert } = chai;

describe('Unit: Types', () => {
    it('should recognize Object instances', () => {
        assert(isObject({}));
        assert(isObject(new Object()));
        assert(!isObject(new Date()));
        assert(!isObject([]));
        assert(!isObject('hello'));
        assert(!isObject(2));
        assert(!isObject(NaN));
        assert(!isObject(() => { }));
        assert(!isObject(Object.toString));
        assert(!isObject(undefined));
        assert(!isObject(null));
        assert(!isObject(false));
    });

    it('should recognize Date instances', () => {
        assert(!isDate({}));
        assert(!isDate(new Object()));
        assert(isDate(new Date()));
        assert(!isDate([]));
        assert(!isDate('hello'));
        assert(!isDate(2));
        assert(!isDate(NaN));
        assert(!isDate(() => { }));
        assert(!isDate(Date.toString));
        assert(!isDate(undefined));
        assert(!isDate(null));
        assert(!isDate(false));
    });

    it('should recognize String instances', () => {
        assert(!isString({}));
        assert(!isString(new Object()));
        assert(!isString(new Date()));
        assert(!isString([]));
        assert(isString('hello'));
        assert(!isString(2));
        assert(!isString(NaN));
        assert(!isString(() => { }));
        assert(!isString(Object.toString));
        assert(!isString(undefined));
        assert(!isString(null));
        assert(!isString(false));
    });

    it('should recognize Number instances', () => {
        assert(!isNumber({}));
        assert(!isNumber(new Object()));
        assert(!isNumber(new Date()));
        assert(!isNumber([]));
        assert(!isNumber('hello'));
        assert(isNumber(2));
        assert(!isNumber(NaN));
        assert(!isNumber(() => { }));
        assert(!isNumber(Object.toString));
        assert(!isNumber(undefined));
        assert(!isNumber(null));
        assert(!isNumber(false));
    });

    it('should recognize Boolean instances', () => {
        assert(!isBoolean({}));
        assert(!isBoolean(new Object()));
        assert(!isBoolean(new Date()));
        assert(!isBoolean([]));
        assert(!isBoolean('hello'));
        assert(!isBoolean(2));
        assert(!isBoolean(NaN));
        assert(!isBoolean(() => { }));
        assert(!isBoolean(Object.toString));
        assert(!isBoolean(undefined));
        assert(!isBoolean(null));
        assert(isBoolean(false));
    });

    it('should recognize Function instances', () => {
        assert(!isFunction({}));
        assert(!isFunction(new Object()));
        assert(!isFunction(new Date()));
        assert(!isFunction([]));
        assert(!isFunction('hello'));
        assert(!isFunction(2));
        assert(!isFunction(NaN));
        assert(isFunction(() => { }));
        assert(isFunction(Object.toString));
        assert(!isFunction(undefined));
        assert(!isFunction(null));
        assert(!isFunction(false));
    });

    it('should recognize undefined values', () => {
        assert(!isUndefined({}));
        assert(!isUndefined(new Object()));
        assert(!isUndefined(new Date()));
        assert(!isUndefined([]));
        assert(!isUndefined('hello'));
        assert(!isUndefined(2));
        assert(!isUndefined(NaN));
        assert(!isUndefined(() => { }));
        assert(!isUndefined(Object.toString));
        assert(isUndefined(undefined));
        assert(!isUndefined(null));
        assert(!isUndefined(false));
    });

    it('should recognize falsy values', () => {
        assert(!isFalsy({}));
        assert(!isFalsy(new Object()));
        assert(!isFalsy(new Date()));
        assert(!isFalsy([]));
        assert(!isFalsy('hello'));
        assert(!isFalsy(2));
        assert(isFalsy(NaN));
        assert(!isFalsy(() => { }));
        assert(!isFalsy(Object.toString));
        assert(isFalsy(undefined));
        assert(isFalsy(null));
        assert(isFalsy(false));
    });
});
