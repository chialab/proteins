/* eslint-env mocha */
import internal from '../src/internal.js';

describe('Unit: Internal', () => {
    let scope = {};
    scope.value = 6;
    scope.message = 'hello';
    internal(scope).message = 'world';

    it('should set private properties', () => {
        assert.equal(scope.value, 6);
        assert.equal(scope.message, 'hello');
        assert.equal(internal(scope).message, 'world');
    });

    it('should check if has internal', () => {
        assert(internal.has(scope));
    });

    it('should destroy internal', () => {
        internal.destroy(scope);
        assert(!internal.has(scope));
        assert.equal(scope.value, 6);
        assert.equal(scope.message, 'hello');
        assert.equal(internal(scope).message, undefined);
    });
});
