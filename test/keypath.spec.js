/* eslint-env mocha */

/**
 * Here we are using some tests from https://github.com/mariocasciaro/object-path
 * because `keypath` is inspired by that library and
 * we want to mantain compatibility for those methods
 * which achive the same result.
 */

import keypath from '../src/keypath.js';
import {
    isObject,
    isArray,
} from '../src/types.js';

function getTestObj() {
    return {
        a: 'b',
        b: {
            c: [],
            d: ['a', 'b'],
            e: [{}, {
                f: 'g',
            }],
            f: 'i',
        },
    };
}

describe('Unit: Keypath', () => {
    describe('get', () => {
        it('should return the value using unicode key', () => {
            let obj = {
                '15\u00f8C': {
                    '3\u0111': 1,
                },
            };
            assert.equal(keypath(obj, '15\u00f8C.3\u0111'), 1);
            assert.equal(keypath(obj, ['15\u00f8C', '3\u0111']), 1);
        });

        it('should return the value using dot in key', () => {
            let obj = {
                'a.b': {
                    'looks.like': 1,
                },
            };
            assert.equal(keypath(obj, 'a.b.looks.like'), null);
            assert.equal(keypath(obj, ['a.b', 'looks.like']), 1);
        });

        it('should return the value under shallow object', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'a'), 'b');
            assert.equal(keypath(obj, ['a']), 'b');
        });

        it('should work with number path', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj.b.d, 0), 'a');
            assert.equal(keypath(obj.b, 0), null);
        });

        it('should return the value under deep object', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'b.f'), 'i');
            assert.equal(keypath(obj, ['b', 'f']), 'i');
        });

        it('should return the value under array', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'b.d.0'), 'a');
            assert.equal(keypath(obj, ['b', 'd', 0]), 'a');
        });

        it('should return the value under array deep', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'b.e.1.f'), 'g');
            assert.equal(keypath(obj, ['b', 'e', 1, 'f']), 'g');
        });

        it('should return undefined for missing values under object', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'a.b'), undefined);
            assert.equal(keypath(obj, ['a', 'b']), undefined);
        });

        it('should return undefined for missing values under array', () => {
            let obj = getTestObj();
            assert.equal(keypath(obj, 'b.d.5'), undefined);
            assert.equal(keypath(obj, ['b', 'd', '5']), undefined);
        });

        it('should return the value under integer-like key', () => {
            let obj = {
                '1a': 'foo',
            };
            assert.equal(keypath(obj, '1a'), 'foo');
            assert.equal(keypath(obj, ['1a']), 'foo');
        });
    });

    describe('set', () => {
        it('should set the value using unicode key', () => {
            let obj = {
                '15\u00f8C': {
                    '3\u0111': 1,
                },
            };
            keypath(obj, '15\u00f8C.3\u0111', 2);
            assert.equal(keypath(obj, '15\u00f8C.3\u0111'), 2);
            keypath(obj, '15\u00f8C.3\u0111', 3);
            assert.equal(keypath(obj, ['15\u00f8C', '3\u0111']), 3);
        });

        it('should set the value using dot in key', () => {
            let obj = {
                'a.b': {
                    'looks.like': 1,
                },
            };
            keypath(obj, ['a.b', 'looks.like'], 2);
            assert.equal(keypath(obj, ['a.b', 'looks.like']), 2);
        });

        it('should set value under shallow object', () => {
            let obj = getTestObj();
            keypath(obj, 'c', {
                m: 'o',
            });
            assert.equal(obj.c.m, 'o');
            obj = getTestObj();
            keypath(obj, ['c'], {
                m: 'o',
            });
            assert.equal(obj.c.m, 'o');
        });

        it('should set value using number path', () => {
            let obj = getTestObj();
            keypath(obj.b.d, 0, 'o');
            assert.equal(obj.b.d[0], 'o');
        });

        it('should set value under deep object', () => {
            let obj = getTestObj();
            keypath(obj, 'b.c', 'o');
            assert.equal(obj.b.c, 'o');
            obj = getTestObj();
            keypath(obj, ['b', 'c'], 'o');
            assert.equal(obj.b.c, 'o');
        });

        it('should set value under array', () => {
            let obj = getTestObj();
            keypath(obj, 'b.e.1.g', 'f');
            assert.equal(obj.b.e[1].g, 'f');
            obj = getTestObj();
            keypath(obj, ['b', 'e', 1, 'g'], 'f');
            assert.equal(obj.b.e[1].g, 'f');

            obj = {};
            keypath(obj, 'b.0', 'a');
            keypath(obj, 'b.1', 'b');
            assert.deepEqual(obj.b, ['a', 'b']);
        });

        it('should create intermediate objects', () => {
            let obj = getTestObj();
            keypath(obj, 'c.d.e.f', 'l');
            assert.equal(obj.c.d.e.f, 'l');
            obj = getTestObj();
            keypath(obj, ['c', 'd', 'e', 'f'], 'l');
            assert.equal(obj.c.d.e.f, 'l');
        });

        it('should create intermediate arrays', () => {
            let obj = getTestObj();
            keypath(obj, 'c.0.1.m', 'l');
            assert(isArray(obj.c));
            assert(isArray(obj.c[0]));
            assert.equal(obj.c[0][1].m, 'l');
            obj = getTestObj();
            keypath(obj, ['c', '0', 1, 'm'], 'l');
            assert(isArray(obj.c));
            assert(isArray(obj.c[0]));
            assert.equal(obj.c[0][1].m, 'l');
        });

        it('should set value under integer-like key', () => {
            let obj = getTestObj();
            keypath(obj, '1a', 'foo');
            assert.equal(obj['1a'], 'foo');
            obj = getTestObj();
            keypath(obj, ['1a'], 'foo');
            assert.equal(obj['1a'], 'foo');
        });

        it('should set value under empty array', () => {
            let obj = [];
            keypath(obj, [0], 'foo');
            assert.equal(obj[0], 'foo');
            obj = [];
            keypath(obj, '0', 'foo');
            assert.equal(obj[0], 'foo');
        });
    });

    describe('ensure', () => {
        it('should create the path if it does not exists', () => {
            let obj = getTestObj();
            let oldVal = keypath.ensure(obj, 'b.g.1.l', 'test');
            assert.equal(oldVal, undefined);
            assert.equal(obj.b.g[1].l, 'test');
            oldVal = keypath.ensure(obj, 'b.g.1.l', 'test1');
            assert.equal(oldVal, 'test');
            assert.equal(obj.b.g[1].l, 'test');
            oldVal = keypath.ensure(obj, 'b.\u8210', 'ok');
            assert.equal(oldVal, undefined);
            assert.equal(obj.b['\u8210'], 'ok');
            oldVal = keypath.ensure(obj, ['b', 'dot.dot'], 'ok');
            assert.equal(oldVal, undefined);
            assert.equal(obj.b['dot.dot'], 'ok');
            obj = {};
            keypath.ensure(obj, ['1', '1'], {});
            assert(isObject(obj));
            assert(isArray(obj[1]));
            assert(isObject(obj[1][1]));
        });
    });

    describe('del', () => {
        it('should work with number path', () => {
            let obj = getTestObj();
            keypath.del(obj.b.d, 1);
            assert.deepEqual(obj.b.d, ['a']);
        });

        it('should remove null and undefined props (but not explode on nested)', () => {
            let obj = {
                nullProp: null,
                undefinedProp: undefined,
            };
            assert(obj.hasOwnProperty('nullProp'));
            assert(obj.hasOwnProperty('undefinedProp'));

            keypath.del(obj, 'nullProp.foo');
            keypath.del(obj, 'undefinedProp.bar');
            assert(obj.hasOwnProperty('nullProp'));
            assert(obj.hasOwnProperty('undefinedProp'));
            assert.deepEqual(obj, {
                nullProp: null,
                undefinedProp: undefined,
            });

            keypath.del(obj, 'nullProp');
            keypath.del(obj, 'undefinedProp');
            assert(!obj.hasOwnProperty('nullProp'));
            assert(!obj.hasOwnProperty('undefinedProp'));
            assert.deepEqual(obj, {});
        });

        it('should delete deep paths', () => {
            let obj = getTestObj();

            keypath(obj, 'b.g.1.0', 'test');
            keypath(obj, 'b.g.1.1', 'test');
            keypath(obj, 'b.h.az', 'test');
            keypath(obj, 'b.\ubeef', 'test');
            keypath(obj, ['b', 'dot.dot'], 'test');

            assert.equal(obj.b.g[1][0], 'test');
            assert.equal(obj.b.g[1][1], 'test');
            assert.equal(obj.b.h.az, 'test');
            assert.equal(obj.b['\ubeef'], 'test');

            keypath.del(obj, 'b.h.az');
            assert(!obj.b.h.hasOwnProperty('az'));
            assert(obj.b.hasOwnProperty('h'));

            keypath.del(obj, 'b.g.1.1');
            assert.equal(obj.b.g[1].length, 1);
            assert.equal(obj.b.g[1][0], 'test');

            keypath.del(obj, 'b.\ubeef');
            assert(!obj.b.hasOwnProperty('\ubeef'));

            keypath.del(obj, ['b', 'dot.dot']);
            assert.equal(keypath(obj, ['b', 'dot.dot']), undefined);

            keypath.del(obj, ['b', 'g', '1', '0']);
            assert.equal(obj.b.g[1].length, 0);

            keypath.del(obj, ['b']);
            assert(!obj.hasOwnProperty('b'));
            assert.deepEqual(obj, {
                a: 'b',
            });
        });

        it('should remove items from existing array', () => {
            let obj = getTestObj();

            keypath.del(obj, 'b.d.0');
            assert.equal(obj.b.d.length, 1);
            assert.deepEqual(obj.b.d, ['b']);

            keypath.del(obj, 'b.d.0');
            assert.equal(obj.b.d.length, 0);
            assert.deepEqual(obj.b.d, []);
        });
    });

    describe('has', () => {
        it('should return false for empty object', () => {
            assert(!keypath.has({}, 'a'));
        });

        it('should handle empty paths properly', () => {
            let obj = getTestObj();
            assert(!keypath.has(obj, ''));
            assert(!keypath.has(obj, ['']));
            obj[''] = 1;
            assert(keypath.has(obj, ''));
            assert(keypath.has(obj, ['']));
        });

        it('should test under shallow object', () => {
            let obj = getTestObj();
            assert(keypath.has(obj, 'a'));
            assert(keypath.has(obj, ['a']));
            assert(!keypath.has(obj, 'z'));
            assert(!keypath.has(obj, ['z']));
        });

        it('should work with number path', () => {
            let obj = getTestObj();
            assert(keypath.has(obj.b.d, 0));
            assert(!keypath.has(obj.b, 0));
            assert(!keypath.has(obj.b.d, 10));
            assert(!keypath.has(obj.b, 10));
        });

        it('should test under deep object', () => {
            let obj = getTestObj();
            assert(keypath.has(obj, 'b.f'));
            assert(keypath.has(obj, ['b', 'f']));
            assert(!keypath.has(obj, 'b.g'));
            assert(!keypath.has(obj, ['b', 'g']));
        });

        it('should test value under array', () => {
            let obj = {
                b: ['a'],
            };
            obj.b[3] = {
                o: 'a',
            };
            assert(keypath.has(obj, 'b.0'));
            assert(keypath.has(obj, 'b.1'));
            assert(keypath.has(obj, 'b.3.o'));
            assert(!keypath.has(obj, 'b.3.qwe'));
            assert(!keypath.has(obj, 'b.4'));
        });

        it('should test the value under array deep', () => {
            let obj = getTestObj();
            assert(keypath.has(obj, 'b.e.1.f'));
            assert(keypath.has(obj, ['b', 'e', 1, 'f']));
            assert(!keypath.has(obj, 'b.e.1.f.g.h.i'));
            assert(!keypath.has(obj, ['b', 'e', 1, 'f', 'g', 'h', 'i']));
        });

        it('should test the value under integer-like key', () => {
            let obj = {
                '1a': 'foo',
            };
            assert(keypath.has(obj, '1a'));
            assert(keypath.has(obj, ['1a']));
        });

        it('should distinct nonexistent key and key = undefined', () => {
            let obj = {};
            assert(!keypath.has(obj, 'key'));

            obj.key = undefined;
            assert(keypath.has(obj, 'key'));
        });

        it('should work with deep undefined/null values', () => {
            let obj = {};
            assert(!keypath.has(obj, 'missing.test'));

            obj.missing = null;
            assert(!keypath.has(obj, 'missing.test'));

            obj.sparseArray = [1, undefined, 3];
            assert(!keypath.has(obj, 'sparseArray.1.test'));
        });
    });

    describe('insert', () => {
        it('should push value to existing array using unicode key', () => {
            let obj = getTestObj();
            keypath.insert(obj, 'b.\u1290c', 'l');
            assert.equal(obj.b['\u1290c'][0], 'l');
            keypath.insert(obj, ['b', '\u1290c'], 'l');
            assert.equal(obj.b['\u1290c'][1], 'l');
        });

        it('should push value to existing array using dot key', () => {
            let obj = getTestObj();
            keypath.insert(obj, ['b', 'z.d'], 'l');
            assert.equal(keypath(obj, ['b', 'z.d', 0]), 'l');
        });

        it('should push value to existing array', () => {
            let obj = getTestObj();
            keypath.insert(obj, 'b.c', 'l');
            assert.equal(obj.b.c[0], 'l');
            obj = getTestObj();
            keypath.insert(obj, ['b', 'c'], 'l');
            assert(obj.b.c[0], 'l');
        });

        it('should push value to new array', () => {
            let obj = getTestObj();
            keypath.insert(obj, 'b.h', 'l');
            assert.equal(obj.b.h[0], 'l');
            obj = getTestObj();
            keypath.insert(obj, ['b', 'h'], 'l');
            assert.equal(obj.b.h[0], 'l');
        });

        it('should create intermediary array', () => {
            let obj = getTestObj();

            keypath.insert(obj, 'b.c.0', 'asdf');
            assert.equal(obj.b.c[0][0], 'asdf');
        });

        it('should insert in another index', () => {
            let obj = getTestObj();

            keypath.insert(obj, 'b.d', 'asdf', 1);
            assert.equal(obj.b.d[1], 'asdf');
            assert.equal(obj.b.d[0], 'a');
            assert.equal(obj.b.d[2], 'b');
        });

        it('should handle sparse array', () => {
            let obj = getTestObj();
            obj.b.d = new Array(4);
            obj.b.d[0] = 'a';
            obj.b.d[1] = 'b';

            keypath.insert(obj, 'b.d', 'asdf', 3);
            // eslint-disable-next-line
            assert.deepEqual(obj.b.d, ['a', 'b', , 'asdf']);
        });
    });

    describe('empty', () => {
        it('should ignore invalid arguments safely', () => {
            let obj = {};
            assert.equal(keypath.empty(obj, 'path'), undefined);
            assert.equal(keypath.empty(obj, ''), undefined);

            obj.path = true;

            assert.equal(keypath.empty(obj, 'inexistant'), undefined);
            assert.equal(keypath.empty(obj, 'path'), true);
        });

        it('should empty each path according to their types', () => {
            let obj = {
                string: 'some string',
                array: ['some', 'array', [1, 2, 3]],
                number: 21,
                boolean: true,
                object: {
                    some: 'property',
                    sub: {
                        property: true,
                    },
                    nullProp: null,
                    undefinedProp: undefined,
                },
            };

            obj['function'] = () => {};

            keypath.empty(obj, ['array', '2']);
            assert.deepEqual(obj.array[2], []);

            keypath.empty(obj, 'object.sub');
            assert.deepEqual(obj.object.sub, {});

            keypath.empty(obj, 'object.nullProp');
            assert.equal(obj.object.nullProp, null);

            keypath.empty(obj, 'object.undefinedProp');
            assert.equal(obj.object.undefinedProp, undefined);
            assert(obj.object.hasOwnProperty('undefinedProp'));

            keypath.empty(obj, 'object.notAProp');
            assert.equal(obj.object.notAProp, undefined);
            assert(!obj.object.hasOwnProperty('notAProp'));

            keypath.empty(obj, 'string');
            keypath.empty(obj, 'number');
            keypath.empty(obj, 'boolean');
            keypath.empty(obj, 'function');
            keypath.empty(obj, 'array');
            keypath.empty(obj, 'object');
            keypath.empty(obj, 'instance');

            assert.equal(obj.string, '');
            assert.deepEqual(obj.array, []);
            assert.equal(obj.number, 0);
            assert.equal(obj.boolean, false);
            assert.deepEqual(obj.object, {});
            assert.equal(obj['function'], null);
        });
    });

    describe('throws', () => {
        it('should throw when passing invalid scope', () => {
            assert.throws(
                () => keypath(null, 'test'),
                Error
            );
            assert.throws(
                () => keypath(undefined, 'test'),
                Error
            );
            assert.throws(
                () => keypath(false, 'test'),
                Error
            );
            assert.throws(
                () => keypath(11, 'test'),
                Error
            );
            assert.throws(
                () => keypath('mine', 'test'),
                Error
            );
        });

        it('should throw when passing invalid path', () => {
            assert.throws(
                () => keypath({}, null),
                Error
            );
            assert.throws(
                () => keypath({}, undefined),
                Error
            );
            assert.throws(
                () => keypath({}, false),
                Error
            );
            assert.throws(
                () => keypath({}, {}),
                Error
            );
            assert.throws(
                () => keypath({}, []),
                Error
            );
        });
    });
});
