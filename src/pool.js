import { flat } from './_helpers.js';

/**
 * Execute a bunch of promises in parallel limiting the number of parallel pending promises.
 *
 * @param {number} workers Number of parallel workers.
 * @param {Iterable<() => Promise<T>>} promiseFactories Iterable of promise factories.
 * @returns {Promise<T[]>}
 * @template T
 */
export function pool(workers, promiseFactories) {
    if (workers < 1) {
        throw new Error('Number of workers must be positive');
    }

    const iterator = indexedIterator(promiseFactories);
    const promises = [];
    for (let i = 0; i < workers; i++) {
        promises.push(worker(iterator));
    }

    return Promise.all(promises).then((results) =>
        flat
            .call(results)
            .sort((a, b) => a.index - b.index)
            .map(({ result }) => result)
    );
}

/**
 * Worker function that dequeues a promise factory and executes it.
 *
 * @param {Iterator<{index: number, value: () => Promise<T>}>} iterator Iterator.
 * @param {{index: number, result: T}[]} results
 * @return {Promise<{index: number, result: T}[]>}
 * @template T
 */
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

/**
 * Iterate over another iterable and keep track of the current index.
 *
 * @param {Iterable<T>} it Original iterable.
 * @returns {Generator<{index: number, value: T}>}
 * @template T
 */
function* indexedIterator(it) {
    let index = 0;
    for (const value of it) {
        yield { index: index++, value };
    }
}
