import { pool } from '@chialab/proteins';
import { describe, expect, test } from 'vitest';

describe('Unit: Pool', () => {
    test('should return empty array when there are no tasks to run', () => {
        const tasks = [];
        return pool(2, tasks).then((res) => {
            expect(res).toEqual([]);
        });
    });

    test('should run all promises', async () => {
        let bitmask = 0;
        const tasks = [
            async () => {
                bitmask |= 1;
            },
            async () => {
                bitmask |= 2;
            },
            async () => {
                bitmask |= 4;
            },
            async () => {
                bitmask |= 8;
            },
        ];

        await pool(2, tasks);
        expect(bitmask).toBe(15);
    });

    test('should return results in the correct order', async () => {
        const factory = (sleep, returnVal) => () =>
            new Promise((resolve) => {
                setTimeout(() => resolve(returnVal), sleep);
            });
        const tasks = [factory(10, 1), factory(20, 2), factory(1, 3), factory(5, 4), factory(1, 5)];

        const res = await pool(2, tasks);
        expect(res).toEqual([1, 2, 3, 4, 5]);
    });

    test('should return results in the correct order when number of promises is less than number of workers', async () => {
        const factory = (sleep, returnVal) => () =>
            new Promise((resolve) => {
                setTimeout(() => resolve(returnVal), sleep);
            });
        const tasks = [factory(10, 1), factory(5, 2), factory(1, 3)];

        const res = await pool(5, tasks);
        expect(res).toEqual([1, 2, 3]);
    });

    test('should return results in the correct order when input is a generator', async () => {
        const factory = (sleep, returnVal) => () =>
            new Promise((resolve) => {
                setTimeout(() => resolve(returnVal), sleep);
            });
        const tasks = (function* () {
            yield factory(10, 1);
            yield factory(20, 2);
            yield factory(1, 3);
            yield factory(5, 4);
            yield factory(1, 5);
        })();

        const res = await pool(2, tasks);
        expect(res).toEqual([1, 2, 3, 4, 5]);
    });

    test('should reject when a promise rejects', async () => {
        let bitmask = 0;
        const factory = (sleep, bit) => () =>
            new Promise((resolve) => {
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

        const err = await pool(2, tasks).catch((err) => err);
        expect(err).toBe('foo');
        expect(bitmask).toBe(1);
    });

    test('should have at most one concurrent task per worker', async () => {
        let current = 0;
        let max = 0;
        const factory = (sleep) => () =>
            new Promise((resolve) => {
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

        await pool(3, tasks);
        expect(current).toBe(0);
        expect(max).toBe(3);
    });

    test('should throw when number of workers is less than one', () => {
        expect(() => pool(0, [])).toThrow('Number of workers must be positive');
    });
});
