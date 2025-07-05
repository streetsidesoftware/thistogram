import { describe, expect, test } from 'vitest';

import { type Data, histogram, pointMinMax, valueMinMaxSymbols } from './histogram.js';

describe('histogram', () => {
    test('simple', () => {
        const data: Data = [
            ['one', 1],
            ['two', 2],
            ['three', 3],
        ];
        expect(histogram(data, { width: 30, maxLabelWidth: 5, title: 'Numbers' })).toBe(
            `\
            Numbers
            one   ┃██████▋             ┃ 1
            two   ┃█████████████▎      ┃ 2
            three ┃████████████████████┃ 3`.replace(/^\s+/gm, ''),
        );
    });

    test('simple negative min', () => {
        const data = [
            ['minus', -1],
            ['2.5', 2.5],
            ['three', 3],
            ['one', 1],
        ] as const;
        expect(histogram(data, { width: 30, maxLabelWidth: 5, title: 'Numbers' })).toBe(
            `\
            Numbers
            minus ┃▏                 ┃  -1
            2.5   ┃███████████████▊  ┃ 2.5
            three ┃██████████████████┃   3
            one   ┃█████████         ┃   1`.replace(/^\s+/gm, ''),
        );
    });

    test('Sine Wave', () => {
        const data = sampleData(20);
        expect(histogram(data, { width: 30, maxLabelWidth: 8, significantDigits: 2, title: 'Sine' })).toBe(
            `\
            Sine
            0  ┃██▊                ┃  0.00
            1  ┃█████▌             ┃  0.17
            2  ┃████████▎          ┃  0.34
            3  ┃██████████▉        ┃  0.50
            4  ┃█████████████▏     ┃  0.64
            5  ┃███████████████▏   ┃  0.77
            6  ┃████████████████▊  ┃  0.87
            7  ┃██████████████████ ┃  0.94
            8  ┃██████████████████▊┃  0.98
            9  ┃███████████████████┃  1.00
            10 ┃██████████████████▊┃  0.98
            11 ┃██████████████████ ┃  0.94
            12 ┃████████████████▊  ┃  0.87
            13 ┃███████████████▏   ┃  0.77
            14 ┃█████████████▏     ┃  0.64
            15 ┃██████████▉        ┃  0.50
            16 ┃████████▎          ┃  0.34
            17 ┃█████▌             ┃  0.17
            18 ┃██▊                ┃  0.00
            19 ┃▏                  ┃ -0.17`.replace(/^\s+/gm, ''),
        );
    });

    test('Point graph', () => {
        const data = sampleData(40);
        expect(
            histogram(data, { width: 80, maxLabelWidth: 8, significantDigits: 2, title: 'Sine', type: 'point' }),
        ).toBe(
            `\
            Sine
            0  ┃                                 ●                                   ┃  0.00
            1  ┃                                       ●                             ┃  0.17
            2  ┃                                             ●                       ┃  0.34
            3  ┃                                                  ●                  ┃  0.50
            4  ┃                                                       ●             ┃  0.64
            5  ┃                                                           ●         ┃  0.77
            6  ┃                                                              ●      ┃  0.87
            7  ┃                                                                 ●   ┃  0.94
            8  ┃                                                                  ●  ┃  0.98
            9  ┃                                                                   ● ┃  1.00
            10 ┃                                                                  ●  ┃  0.98
            11 ┃                                                                 ●   ┃  0.94
            12 ┃                                                              ●      ┃  0.87
            13 ┃                                                           ●         ┃  0.77
            14 ┃                                                       ●             ┃  0.64
            15 ┃                                                  ●                  ┃  0.50
            16 ┃                                             ●                       ┃  0.34
            17 ┃                                       ●                             ┃  0.17
            18 ┃                                 ●                                   ┃  0.00
            19 ┃                           ●                                         ┃ -0.17
            20 ┃                     ●                                               ┃ -0.34
            21 ┃                ●                                                    ┃ -0.50
            22 ┃           ●                                                         ┃ -0.64
            23 ┃       ●                                                             ┃ -0.77
            24 ┃    ●                                                                ┃ -0.87
            25 ┃ ●                                                                   ┃ -0.94
            26 ┃●                                                                    ┃ -0.98
            27 ┃●                                                                    ┃ -1.00
            28 ┃●                                                                    ┃ -0.98
            29 ┃ ●                                                                   ┃ -0.94
            30 ┃    ●                                                                ┃ -0.87
            31 ┃       ●                                                             ┃ -0.77
            32 ┃           ●                                                         ┃ -0.64
            33 ┃                ●                                                    ┃ -0.50
            34 ┃                     ●                                               ┃ -0.34
            35 ┃                           ●                                         ┃ -0.17
            36 ┃                                 ●                                   ┃ -0.00
            37 ┃                                       ●                             ┃  0.17
            38 ┃                                             ●                       ┃  0.34
            39 ┃                                                  ●                  ┃  0.50`.replace(/^\s+/gm, ''),
        );
    });

    test('point-min-max temperature', () => {
        const data: Data = [
            ['Jan', 2, 1, 6],
            ['Feb', 2, 0, 6],
            ['Mar', 4, 2, 10],
            ['Apr', 8, 4, 13],
            ['May', 12, 8, 17],
            ['Jun', 16, 12, 20],
            ['Jul', 18, 13, 22],
            ['Aug', 18, 13, 23],
            ['Sep', 14, 10, 19],
            ['Oct', 10, 6, 15],
            ['Nov', 6, 4, 10],
            ['Dec', 3, 2, 7],
        ];
        expect(
            histogram(data, {
                width: 80,
                maxLabelWidth: 5,
                title: 'Temperature Degrees C',
                type: 'point-min-max',
                headers: ['Month', 'Avg', 'Min', 'Max'],
            }),
        ).toBe(
            `\
            Temperature Degrees C
            Month ┃                                                        ┃ Avg ┃ Min ┃ Max
            ━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━╋━━━━━╋━━━━
            Jan   ┃  ┣━━●━━━━━━━━┫                                         ┃   2 ┃   1 ┃   6
            Feb   ┃┣━━━━●━━━━━━━━┫                                         ┃   2 ┃   0 ┃   6
            Mar   ┃     ┣━━━━●━━━━━━━━━━━━━┫                               ┃   4 ┃   2 ┃  10
            Apr   ┃          ┣━━━━━━━━●━━━━━━━━━━━┫                        ┃   8 ┃   4 ┃  13
            May   ┃                   ┣━━━━━━━━━●━━━━━━━━━━━┫              ┃  12 ┃   8 ┃  17
            Jun   ┃                             ┣━━━━━━━━●━━━━━━━━━┫       ┃  16 ┃  12 ┃  20
            Jul   ┃                               ┣━━━━━━━━━━━●━━━━━━━━━┫  ┃  18 ┃  13 ┃  22
            Aug   ┃                               ┣━━━━━━━━━━━●━━━━━━━━━━━┫┃  18 ┃  13 ┃  23
            Sep   ┃                        ┣━━━━━━━━●━━━━━━━━━━━┫          ┃  14 ┃  10 ┃  19
            Oct   ┃              ┣━━━━━━━━━●━━━━━━━━━━━┫                   ┃  10 ┃   6 ┃  15
            Nov   ┃          ┣━━━●━━━━━━━━━┫                               ┃   6 ┃   4 ┃  10
            Dec   ┃     ┣━●━━━━━━━━━┫                                      ┃   3 ┃   2 ┃   7`.replace(/^\s+/gm, ''),
        );
    });

    test('point-min-max temperature with custom headers', () => {
        const d = `
            AdaDoom3/AdaDoom3              ┃   1.012 ┃ 0.991 ┃ 1.009
            alexiosc/megistos              ┃   0.996 ┃ 0.963 ┃ 1.037
            apollographql/apollo-server    ┃   1.031 ┃ 0.975 ┃ 1.047
            aspnetboilerplate/aspnetboiler ┃   1.025 ┃ 0.999 ┃ 1.001
            aws-amplify/docs               ┃    1.05 ┃ 0.977 ┃ 1.023
            Azure/azure-rest-api-specs     ┃   1.031 ┃ 0.986 ┃ 1.014
            bitjson/typescript-starter     ┃   1.028 ┃ 0.987 ┃ 1.013
            caddyserver/caddy              ┃   0.993 ┃ 0.988 ┃ 1.012
            canada-ca/open-source-logiciel ┃   1.103 ┃ 0.996 ┃ 1.004
            chef/chef                      ┃   0.983 ┃  0.99 ┃  1.01
            django/django                  ┃   0.986 ┃ 0.991 ┃ 1.009
            eslint/eslint                  ┃   0.891 ┃ 0.913 ┃ 1.087
            exonum/exonum                  ┃   1.021 ┃  0.99 ┃  1.01
            gitbucket/gitbucket            ┃   1.092 ┃ 0.996 ┃ 1.004
            googleapis/google-cloud-cpp    ┃   0.995 ┃ 0.938 ┃ 1.055
            graphql/express-graphql        ┃   0.982 ┃ 0.994 ┃ 1.005
        `;

        const data: Data = d
            .split('\n')
            .map((a) => a.trim())
            .filter((a) => !!a)
            .map((line) => line.split('┃').map((a) => a.trim()))
            .map(([label, value, min, max]) => [label, parseFloat(value), parseFloat(min), parseFloat(max)] as const);

        const maxVal = data.reduce((curr, [, value, min, max]) => Math.max(curr, value, min ?? 1, max ?? 1), 1);
        const minVal = data.reduce((curr, [, value, min, max]) => Math.min(curr, value, min ?? 1, max ?? 1), 1);
        const maxDiff = Math.max(Math.abs(maxVal - 1), Math.abs(minVal - 1));

        expect(
            histogram(data, {
                width: 100,
                maxLabelWidth: 30,
                title: 'Performance Deviation',
                type: 'point-min-max',
                headers: ['Repo', 'Val', 'Min', 'Max'],
                max: 1 + maxDiff * 1.1,
                min: 1 - maxDiff * 1.1,
            }),
        ).toBe(
            `\
            Performance Deviation
            Repo                           ┃                                             ┃   Val ┃   Min ┃   Max
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━╋━━━━━━━╋━━━━━━
            AdaDoom3/AdaDoom3              ┃                    ┣━━━●                    ┃ 1.012 ┃ 0.991 ┃ 1.009
            alexiosc/megistos              ┃               ┣━━━━━●━━━━━━━┫               ┃ 0.996 ┃ 0.963 ┃ 1.037
            apollographql/apollo-server    ┃                 ┣━━━━━━━━━━●━━┫             ┃ 1.031 ┃ 0.975 ┃ 1.047
            aspnetboilerplate/aspnetboiler ┃                      ┫    ●                 ┃ 1.025 ┃ 0.999 ┃ 1.001
            aws-amplify/docs               ┃                  ┣━━━━━━━┫    ●             ┃  1.05 ┃ 0.977 ┃ 1.023
            Azure/azure-rest-api-specs     ┃                   ┣━━━━━┫  ●                ┃ 1.031 ┃ 0.986 ┃ 1.014
            bitjson/typescript-starter     ┃                    ┣━━━┫  ●                 ┃ 1.028 ┃ 0.987 ┃ 1.013
            caddyserver/caddy              ┃                    ┣●━━┫                    ┃ 0.993 ┃ 0.988 ┃ 1.012
            canada-ca/open-source-logiciel ┃                     ┣━┫                 ●   ┃ 1.103 ┃ 0.996 ┃ 1.004
            chef/chef                      ┃                   ●┣━━━┫                    ┃ 0.983 ┃  0.99 ┃  1.01
            django/django                  ┃                   ●┣━━━┫                    ┃ 0.986 ┃ 0.991 ┃ 1.009
            eslint/eslint                  ┃  ●   ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫      ┃ 0.891 ┃ 0.913 ┃ 1.087
            exonum/exonum                  ┃                    ┣━━━┫ ●                  ┃ 1.021 ┃  0.99 ┃  1.01
            gitbucket/gitbucket            ┃                     ┣━┫               ●     ┃ 1.092 ┃ 0.996 ┃ 1.004
            googleapis/google-cloud-cpp    ┃           ┣━━━━━━━━━●━━━━━━━━━━┫            ┃ 0.995 ┃ 0.938 ┃ 1.055
            graphql/express-graphql        ┃                   ● ┣━┫                     ┃ 0.982 ┃ 0.994 ┃ 1.005`.replace(
                /^\s+/gm,
                '',
            ),
        );
    });

    const U = undefined;

    test.each`
        value  | minVal | maxVal | width | padding | symbols               | expected
        ${0.5} | ${0}   | ${1}   | ${11} | ${' '}  | ${valueMinMaxSymbols} | ${'┣━━━━●━━━━┫'}
        ${0.5} | ${0}   | ${1}   | ${11} | ${U}    | ${undefined}          | ${'┣━━━━●━━━━┫'}
        ${0.5} | ${U}   | ${U}   | ${11} | ${'.'}  | ${undefined}          | ${'.....●.....'}
        ${0.6} | ${0}   | ${1.0} | ${11} | ${' '}  | ${valueMinMaxSymbols} | ${'┣━━━━━●━━━┫'}
        ${0.6} | ${0}   | ${0.6} | ${11} | ${' '}  | ${valueMinMaxSymbols} | ${'┣━━━━━●    '}
        ${0.6} | ${0}   | ${0.6} | ${11} | ${'.'}  | ${valueMinMaxSymbols} | ${'┣━━━━━●....'}
        ${0.6} | ${0.6} | ${1}   | ${11} | ${'.'}  | ${valueMinMaxSymbols} | ${'......●━━━┫'}
        ${0.5} | ${0.4} | ${0.8} | ${11} | ${'.'}  | ${undefined}          | ${'....┣●━━┫..'}
    `(
        'pointMinMax $value, $minVal, $maxVal, $width, $padding, $symbols',
        ({ value, minVal, maxVal, width, padding, symbols, expected }) => {
            const r = pointMinMax(value, minVal, maxVal, width, padding, symbols);
            expect(r.length).toBe(width);
            expect(r).toBe(expected);
        },
    );
});

function sampleData(num: number, scale = 1, step = 5): Data {
    const data: [string, number][] = [];

    let value = 0;

    for (let i = 0; i < num; i++) {
        data.push([`${i}`, Math.sin(((Math.PI * 2) / 180) * value) * scale]);
        value += step;
    }

    return data;
}
