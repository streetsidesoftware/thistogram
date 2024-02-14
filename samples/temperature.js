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
