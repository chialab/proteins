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

    it('should destroy private properties', () => {
        internal.destroy(scope);
        assert.equal(scope.value, 6);
        assert.equal(scope.message, 'hello');
        assert.equal(internal(scope).message, undefined);
    });
});
