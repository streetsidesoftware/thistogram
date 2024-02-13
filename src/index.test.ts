import { describe, expect, test } from 'vitest';

import { type Data, histogram } from './index.js';

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
            three ┃████████████████████┃ 3`.replace(/^\s+/gm, '')
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
            one   ┃█████████         ┃   1`.replace(/^\s+/gm, '')
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
            19 ┃▏                  ┃ -0.17`.replace(/^\s+/gm, '')
        );
    });

    test('Point graph', () => {
        const data = sampleData(40);
        expect(histogram(data, { width: 80, maxLabelWidth: 8, significantDigits: 2, title: 'Sine', type: 'point' })).toBe(
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
            39 ┃                                                  ●                  ┃  0.50`.replace(/^\s+/gm, '')
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
            })
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
            Dec   ┃     ┣━●━━━━━━━━━┫                                      ┃   3 ┃   2 ┃   7`.replace(/^\s+/gm, '')
        );
    });
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
