import { equivalent } from '@chialab/proteins';
import { assert, describe, test } from 'vitest';

describe('Unit: Equivalent', () => {
    const TEST_FUN = () => {};
    const TEST_DATE = new Date();

    const CIRCULAR_REFERENCE = {
        answer: 42,
        correct: true,
    };
    // eslint-disable-next-line
    CIRCULAR_REFERENCE.question = {
        text: 'The Ultimate Question of Life, the Universe and Everything',
        attempts: [CIRCULAR_REFERENCE],
    };

    const ANOTHER_CIRCULAR_REFERENCE = {
        answer: 42,
        correct: true,
    };
    // eslint-disable-next-line
    ANOTHER_CIRCULAR_REFERENCE.question = {
        text: 'The Ultimate Question of Life, the Universe and Everything',
        attempts: [ANOTHER_CIRCULAR_REFERENCE],
    };

    test('should check simple equivalences', () => {
        assert(equivalent('A', 'A'));
        assert(equivalent('Abc', 'Abc'));
        assert(equivalent(1, 1));
        assert(equivalent(-10, -10));
        assert(equivalent(Infinity, Infinity));
        assert(equivalent(true, true));
        assert(equivalent(false, false));
        assert(equivalent(TEST_FUN, TEST_FUN));
        assert(equivalent(TEST_DATE, new Date(TEST_DATE.getTime())));
        assert(equivalent(new Number(42), new Number(42)));
        assert(equivalent(new String('Synapse'), new String('Synapse')));
        assert(equivalent(new Array(['DNA', 'Synapse', 'Proteins']), new Array(['DNA', 'Synapse', 'Proteins'])));
        assert(!equivalent('1', 1));
        assert(!equivalent(-10, '-10'));
        assert(!equivalent('true', true));
        assert(!equivalent(true, 1));
        assert(!equivalent(TEST_FUN, TEST_FUN.bind(null)));
    });

    test('should check arrays equivalences', () => {
        assert(equivalent(['A', 'Abc'], ['A', 'Abc']));
        assert(equivalent(['A', true, 'Abc', 2], ['A', true, 'Abc', 2]));
        assert(equivalent([1, 2, 3], [1, 2, 3]));
        assert(!equivalent([1, 2, 3], [1, 2, 4]));
        assert(!equivalent([1, 2, 3], [1, 2, 3, 4]));
        assert(!equivalent([1, 2, 3, 4], [1, 2, 3]));
    });

    test('should check objects equivalences', () => {
        assert(
            equivalent(
                {
                    a: true,
                },
                {
                    a: true,
                }
            )
        );
        assert(
            equivalent(
                {
                    a: true,
                    b: 1,
                    c: ['hello'],
                },
                {
                    a: true,
                    b: 1,
                    c: ['hello'],
                }
            )
        );
        assert(
            equivalent(
                {
                    a: true,
                    c: ['hello'],
                    b: 1,
                },
                {
                    b: 1,
                    c: ['hello'],
                    a: true,
                }
            )
        );
        assert(
            equivalent(
                {
                    a: true,
                    c: ['hello'],
                    b: 1,
                    fn: TEST_FUN,
                },
                {
                    b: 1,
                    c: ['hello'],
                    fn: TEST_FUN,
                    a: true,
                }
            )
        );
        const obj = {
            arr: [1, 2, 3],
        };
        assert(
            equivalent(
                {
                    a: true,
                    c: ['hello', obj],
                    b: 1,
                    fn: TEST_FUN,
                },
                {
                    b: 1,
                    c: ['hello', obj],
                    fn: TEST_FUN,
                    a: true,
                }
            )
        );
        assert(equivalent(ANOTHER_CIRCULAR_REFERENCE, CIRCULAR_REFERENCE));
        ANOTHER_CIRCULAR_REFERENCE.question.attempts.push({
            answer: 99,
            correct: false,
        });
        assert(!equivalent(ANOTHER_CIRCULAR_REFERENCE, CIRCULAR_REFERENCE));
        assert(
            !equivalent(
                {
                    a: true,
                    b: 1,
                    c: ['hello'],
                },
                {
                    a: true,
                    b: 1,
                    c: ['hello'],
                    d: undefined,
                }
            )
        );
        assert(
            !equivalent(
                {
                    a: true,
                    b: 1,
                    c: ['hello'],
                },
                {
                    a: 'true',
                    b: 1,
                    c: ['hello'],
                }
            )
        );
    });
});
