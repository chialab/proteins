import { assert } from '@chialab/ginsenghino';
import { pool } from '@chialab/proteins';

describe('Unit: Pool', () => {
    it('should return empty array when there are no tasks to run', () => {
        const tasks = [];
        return pool(2, tasks).then((res) => {
            assert.deepEqual(res, []);
        });
    });

    it('should run all promises', () => {
        let bitmask = 0;
        const tasks = [
            async () => { bitmask |= 1; },
            async () => { bitmask |= 2; },
            async () => { bitmask |= 4; },
            async () => { bitmask |= 8; },
        ];

        return pool(2, tasks).then(() => {
            assert.equal(bitmask, 15);
        });
    });

    it('should return results in the correct order', () => {
        const factory = (sleep, returnVal) => () => new Promise((resolve) => {
            setTimeout(() => resolve(returnVal), sleep);
        });
        const tasks = [
            factory(10, 1),
            factory(20, 2),
            factory(1, 3),
            factory(5, 4),
            factory(1, 5),
        ];

        return pool(2, tasks).then((res) => {
            assert.deepEqual(res, [1, 2, 3, 4, 5]);
        });
    });

    it('should return results in the correct order when number of promises is less than number of workers', () => {
        const factory = (sleep, returnVal) => () => new Promise((resolve) => {
            setTimeout(() => resolve(returnVal), sleep);
        });
        const tasks = [
            factory(10, 1),
            factory(5, 2),
            factory(1, 3),
        ];

        return pool(5, tasks).then((res) => {
            assert.deepEqual(res, [1, 2, 3]);
        });
    });

    it('should return results in the correct order when input is a generator', () => {
        const factory = (sleep, returnVal) => () => new Promise((resolve) => {
            setTimeout(() => resolve(returnVal), sleep);
        });
        const tasks = function* () {
            yield factory(10, 1);
            yield factory(20, 2);
            yield factory(1, 3);
            yield factory(5, 4);
            yield factory(1, 5);
        }();

        return pool(2, tasks).then((res) => {
            assert.deepEqual(res, [1, 2, 3, 4, 5]);
        });
    });

    it('should reject when a promise rejects', () => {
        let bitmask = 0;
        const factory = (sleep, bit) => () => new Promise((resolve) => {
            setTimeout(() => {
                bitmask |= bit;
                resolve();
            }, sleep);
        });
        const tasks = [
            factory(20, 1),
            factory(5, 1),
            factory(1, 1),
            () => Promise.reject('foo'),
            factory(10, 2),
            factory(20, 2),
            () => Promise.reject('bar'),
        ];

        return pool(2, tasks)
            .then(
                () => assert.fail('should have rejected'),
                (err) => {
                    assert.equal(err, 'foo');
                    assert.equal(bitmask, 1);
                }
            );
    });

    it('should have at most one concurrent task per worker', () => {
        let current = 0;
        let max = 0;
        const factory = (sleep) => () => new Promise((resolve) => {
            current++;
            max = Math.max(max, current);
            setTimeout(() => {
                max = Math.max(max, current);
                resolve();
                current--;
            }, sleep);
        });
        const tasks = [
            factory(10),
            factory(5),
            factory(1),
            factory(5),
            factory(10),
            factory(5),
            factory(1),
            factory(2),
            factory(5),
        ];

        return pool(3, tasks).then(() => {
            assert.equal(current, 0);
            assert.equal(max, 3);
        });
    });

    it('should throw when number of workers is less than one', () => {
        assert.throws(() => {
            pool(0, []);
        }, 'Number of workers must be positive');
    });
});
