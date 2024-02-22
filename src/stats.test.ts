import { describe, expect, test } from 'vitest';

import { calcMean, calcMedian, calcStandardDeviation, calcVariance } from './stats.js';

describe('stats', () => {
    test.each`
        values          | expected
        ${[1, 4, 2, 3]} | ${2.5}
        ${[1, 3, 2]}    | ${2}
        ${[1, 1, 1, 5]} | ${1}
        ${[]}           | ${NaN}
    `('median $values', ({ values, expected }) => {
        expect(calcMedian(Object.freeze(values))).toBe(expected);
    });

    test.each`
        values          | expected
        ${[1, 4, 2, 3]} | ${1.118033988749895}
        ${[1, 3, 2]}    | ${0.816496580927726}
        ${[]}           | ${NaN}
    `('standard deviation $values', ({ values, expected }) => {
        expect(calcStandardDeviation(values)).toBe(expected);
    });

    test.each`
        values          | expected
        ${[1, 4, 2, 3]} | ${2.5}
        ${[1, 3, 2]}    | ${2}
        ${[1, 1, 1, 5]} | ${2}
        ${[]}           | ${NaN}
    `('mean $values', ({ values, expected }) => {
        expect(calcMean(values)).toBe(expected);
    });

    test.each`
        values          | mean         | expected
        ${[1, 4, 2, 3]} | ${2.5}       | ${1.25}
        ${[1, 3, 2]}    | ${2}         | ${0.6666666666666666}
        ${[1, 3, 2]}    | ${undefined} | ${0.6666666666666666}
        ${[]}           | ${NaN}       | ${NaN}
    `('variance $values', ({ values, mean, expected }) => {
        expect(calcVariance(values, mean)).toBe(expected);
    });
});
