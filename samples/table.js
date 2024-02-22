import { simpleHistogram } from 'thistogram';

const data = [
    ['jan', [5, 7, 9, 12]],
    ['feb', [13, 10, 8, 15]],
    ['mar', [14, 11, 9, 16]],
    ['apr', [17, 15, 22, 18]],
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
        const histo = simpleHistogram(monthData, 0, 25);
        lines.push(
            `| ${month} | ${avg.toFixed(1)} | ${min} | ${max} | \`${histo}\` |`,
        );
    }
    lines.push('');
    lines.push(
        'The table above shows the average, minimum, and maximum temperature for each month.',
    );
    const trendGraph = simpleHistogram(
        data.flatMap(([, d]) => d),
        0,
        25,
    );
    lines.push('');
    lines.push(`Weekly Trend: \`${trendGraph}\``);
    return lines.join('\n');
}

console.log(table());
