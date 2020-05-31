// -----------------------------------------
// | @author: Yuto Watanabe                |
// |                                       |
// | Copyright (c) 2020 Earthquake alert   |
// -----------------------------------------
const argv = require('argv');
const d3 = Object.assign({}, require("d3"), require("d3-queue"));
const fs = require("fs");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const document = new JSDOM(``).window.document;

global.fetch = require("node-fetch");

// argv set and loading
argv.option({
    name: 'out',
    short: 'o',
    type: 'string',
    description: 'Path of svg to output',
    example: "'script --out=output.svg' or 'script -o out.svg'"
});
argv.option({
    name: 'in',
    short: 'i',
    type: 'string',
    description: 'Path of json to input',
    example: "'script --in=input.json' or 'script -i input.json'"
});
argv.option({
    name: 'width',
    short: 'w',
    type: 'int',
    description: 'width of svg',
    example: "'script --width=100' or 'script -w 100'"
});
argv.option({
    name: 'height',
    short: 'h',
    type: 'int',
    description: 'height of svg',
    example: "'script --height 100' or 'script -h 100'"
});

_argv = argv.run

const area_info = require(_argv.options.in[0]);
const save_svg_path = _argv.options.out[0];
const width = _argv.options.width[0];
const height = _argv.options.height[0];

const q = d3.queue()
    .defer(fs.readFile, 'japan_geojson/land/japan.geojson');

q.awaitAll((err, files) => {
    if (err) throw err;
    const data = files.map(str => JSON.parse(str));


})
