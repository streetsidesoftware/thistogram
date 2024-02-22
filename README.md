# Thistogram

A simple text based histogram and chart generator.

## Usage

### Histogram

<!--- @@inject: samples/histogram.js --->

```js
import { histogram } from 'thistogram';

const data = [
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['2.5', 2.5],
];
const hist = histogram(data, {
    width: 40,
    maxLabelWidth: 5,
    title: 'Numbers',
    headers: ['Label', 'Value'],
});
console.log(hist);
```

<!--- @@inject-end: samples/histogram.js --->

Result:

<!--- @@inject: static/histogram.txt --->

```
Numbers
Label ┃                          ┃ Value
━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━
one   ┃██████▌                   ┃     1
two   ┃█████████████             ┃     2
three ┃███████████████████▌      ┃     3
four  ┃██████████████████████████┃     4
2.5   ┃████████████████▎         ┃   2.5
```

<!--- @@inject-end: static/histogram.txt --->

### Point-Min-Max Chart

Code:

<!--- @@inject: samples/temperature.js --->

```js
import { histogram } from 'thistogram';

const data = [
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
const graph = histogram(data, {
    width: 70,
    maxLabelWidth: 5,
    title: 'Temperature Degrees C',
    type: 'point-min-max',
    headers: ['Month', 'Avg', 'Min', 'Max'],
});
console.log(graph);
```

<!--- @@inject-end: samples/temperature.js --->

Result:

<!--- @@inject: static/temperature.txt --->

```
Temperature Degrees C
Month ┃                                              ┃ Avg ┃ Min ┃ Max
━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━╋━━━━━╋━━━━
Jan   ┃  ┣━●━━━━━━━┫                                 ┃   2 ┃   1 ┃   6
Feb   ┃┣━━━●━━━━━━━┫                                 ┃   2 ┃   0 ┃   6
Mar   ┃    ┣━━━●━━━━━━━━━━━┫                         ┃   4 ┃   2 ┃  10
Apr   ┃        ┣━━━━━━━●━━━━━━━━┫                    ┃   8 ┃   4 ┃  13
May   ┃                ┣━━━━━━●━━━━━━━━━┫            ┃  12 ┃   8 ┃  17
Jun   ┃                       ┣━━━━━━━●━━━━━━━┫      ┃  16 ┃  12 ┃  20
Jul   ┃                         ┣━━━━━━━━━●━━━━━━━┫  ┃  18 ┃  13 ┃  22
Aug   ┃                         ┣━━━━━━━━━●━━━━━━━━━┫┃  18 ┃  13 ┃  23
Sep   ┃                    ┣━━━━━━●━━━━━━━━━┫        ┃  14 ┃  10 ┃  19
Oct   ┃            ┣━━━━━━━●━━━━━━━━┫                ┃  10 ┃   6 ┃  15
Nov   ┃        ┣━━━●━━━━━━━┫                         ┃   6 ┃   4 ┃  10
Dec   ┃    ┣━●━━━━━━━┫                               ┃   3 ┃   2 ┃   7
```

<!--- @@inject-end: static/temperature.txt --->

### Simple Histogram

Code:

<!--- @@inject: samples/table.js --->

```js
import { simpleHistogram } from 'thistogram';

const data = [
    ['jan', [5, 7, 9, 12]],
    ['feb', [13, 10, 8, 15]],
    ['mar', [14, 11, 9, 16]],
    ['apr', [17, 14, 12, 19]],
];

function calcAvg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function table() {
    const lines = [];
    lines.push('| Month | Avg |  Min |  Max | Graph |');
    lines.push('|-------|----:|-----:|-----:|-------|');
    for (const [month, monthData] of data) {
        const avg = calcAvg(monthData);
        const min = Math.min(...monthData);
        const max = Math.max(...monthData);
        const histo = simpleHistogram(monthData, 0, 20);
        lines.push(
            `| ${month} | ${avg.toFixed(1)} | ${min} | ${max} | ${histo} |`,
        );
    }
    return lines.join('\n');
}

console.log(table());
```

<!--- @@inject-end: samples/table.js --->

Result:

<!--- @@inject: static/table.md --->

| Month |  Avg | Min | Max | Graph |
| ----- | ---: | --: | --: | ----- |
| jan   |  8.3 |   5 |  12 | ▂▃▄▅  |
| feb   | 11.5 |   8 |  15 | ▆▄▄▆  |
| mar   | 12.5 |   9 |  16 | ▆▅▄▇  |
| apr   | 15.5 |  12 |  19 | ▇▆▅█  |

<!--- @@inject-end: static/table.md --->

## Examples

```
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
19 ┃▏                  ┃ -0.17
```
