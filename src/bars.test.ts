import { describe, expect, test } from 'vitest';

import { barHorizontal, plotPointRelativeToStandardDeviation, simpleHistogram } from './bars.js';

describe('simpleHistogram', () => {
    test('should return a string of the histogram', () => {
        const data = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const result = simpleHistogram(data, 0, 9);
        expect(result).toBe(' ▁▂▃▄▅▆▇█');
    });

    test.each`
        data                                   | min          | max          | expected
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8]}         | ${undefined} | ${undefined} | ${'▁▂▃▄▄▅▆▇█'}
        ${[0, 0, 0]}                           | ${undefined} | ${undefined} | ${'   '}
        ${[1, 2, 3, 4, 5, 6, 7, 8]}            | ${0}         | ${undefined} | ${'▁▂▃▄▅▆▇█'}
        ${[1, 2, 3, 4, 5, 6, 7, 8]}            | ${4}         | ${undefined} | ${'    ▂▄▆█'}
        ${[-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]} | ${0}         | ${undefined} | ${'   ▁▂▃▄▅▆▇█'}
        ${[0, 1, 2, 3, 4, 5, 1, 7, 8, 9, 10]}  | ${undefined} | ${8}         | ${'▁▂▃▄▅▆▂████'}
    `('simpleHistogram $data', ({ data, min, max, expected }) => {
        const result = simpleHistogram(data, min, max);
        expect(result).toBe(expected);
    });

    test('should use the provided bar characters', () => {
        const data = [1, 2, 3, 4, 5];
        const barChars = ['-', '+', '*', '#'];
        const result = simpleHistogram(data, undefined, undefined, barChars);
        expect(result.length).toBe(data.length);
        expect(result).toBe('-++*#');
    });
});

describe('barHorizontal', () => {
    test('should return a string of the bar', () => {
        const value = 0.75;
        const width = 10;
        const result = barHorizontal(value, width);
        expect(result).toBe('█'.repeat(7) + '▌  ');
    });

    test('should use the provided bar characters', () => {
        const value = 0.5;
        const width = 10;
        const barChars = ['-', '+', '*', '#'];
        const result = barHorizontal(value, width, ' ', barChars);
        expect(result).toBe('#####     ');
    });
});

describe('plotPointRelativeToStandardDeviation', () => {
    test('should return a string of the plot', () => {
        const point = 0.5;
        const sd = 1;
        const mean = 0.5;
        const width = 15;
        const result = plotPointRelativeToStandardDeviation(point, sd, mean, width, 1.0);
        expect(result).toBe('┣━━━━━━●━━━━━━┫');
    });

    test.each`
        point  | sd   | mean | width | range        | expected
        ${-1}  | ${2} | ${0} | ${25} | ${2}         | ${'┣━━━━━┻━━●━━╋━━━━━┻━━━━━┫'}
        ${-1}  | ${2} | ${0} | ${25} | ${undefined} | ${'  ┣━━━━┻━━●━╋━━━━┻━━━━┫  '}
        ${1}   | ${2} | ${0} | ${35} | ${3}         | ${'     ┣━━━━━┻━━━━━╋━━●━━┻━━━━━┫     '}
        ${5}   | ${2} | ${0} | ${35} | ${3}         | ${'     ┣━━━━━┻━━━━━╋━━━━━┻━━━━━┫  ●  '}
        ${-10} | ${2} | ${0} | ${35} | ${3}         | ${'●    ┣━━━━━┻━━━━━╋━━━━━┻━━━━━┫     '}
        ${1}   | ${2} | ${0} | ${34} | ${3}         | ${'      ┣━━━━┻━━━━━╋━━●━━┻━━━━┫     '}
    `('plotPointRelativeToStandardDeviation $point', ({ point, sd, mean, width, range, expected }) => {
        const result = plotPointRelativeToStandardDeviation(point, sd, mean, width, range);
        expect(result).toBe(expected);
        expect(result.length).toBe(width);
    });
});
