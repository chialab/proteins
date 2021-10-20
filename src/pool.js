/**
 * Execute a bunch of promises in parallel limiting the number of parallel pending promises.
 *
 * @param {number} workers Number of parallel workers.
 * @param {(() => Promise<T>)[]} promiseFactories List of promise factories.
 * @returns {Promise<T[]>}
 * @template T
 */
export function pool(workers, promiseFactories) {
    if (workers < 1) {
        throw new Error('Number of workers must be positive');
    }

    const results = Array(promiseFactories.length);
    const iterator = arrayIterator(promiseFactories);
    const dequeuer = () => {
        const next = iterator.next();
        if (next.done) {
            return Promise.resolve();
        }

        const { index, value } = next.value;

        return value()
            .then((res) => {
                results[index] = res;

                return dequeuer();
            });
    };

    const promises = [];
    for (let i = 0; i < workers; i++) {
        promises.push(dequeuer());
    }

    return Promise.all(promises)
        .then(() => results);
};

/**
 * Iterate over an array and keep track of the current index.
 *
 * @param {T[]} arr Array to iterate over.
 * @returns {Generator<{index: number, value: T}>}
 * @template T
 */
function* arrayIterator(arr) {
    for (let index = 0; index < arr.length; index++) {
        const value = arr[index];
        yield { index, value };
    }
}
