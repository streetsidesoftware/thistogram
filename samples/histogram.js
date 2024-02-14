import { histogram } from 'thistogram';

const data = [
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['2.5', 2.5],
];
const hist = histogram(data, { width: 40, maxLabelWidth: 5, title: 'Numbers', headers: ['Label', 'Value'] });
console.log(hist);
