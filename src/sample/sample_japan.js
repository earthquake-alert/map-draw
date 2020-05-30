// d3.jsの表示テスト
const d3 = Object.assign({}, require("d3"), require("d3-queue"));
const jsdom = require("jsdom");
const fs = require("fs");
const { JSDOM } = jsdom;
global.fetch = require("node-fetch");

const document = new JSDOM(``).window.document;

var width = 600,
    height = 600;
var scale = 1600;

const q = d3.queue()
    .defer(fs.readFile, 'japan_geojson/land/japan.geojson');

q.awaitAll((err, files) => {
    if (err) throw err;
    const data = files.map(str => JSON.parse(str));


    var aProjection = d3.geoMercator()
        .center([136.0, 35.6])
        .translate([width / 2, height / 2])
        .scale(scale);
    var geoPath = d3.geoPath().projection(aProjection);
    var svg = d3.select(document.body)
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    //マップ描画
    var map = svg.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .style("stroke", "#ffffff")
        .style("stroke-width", 0.1)
        .style("fill", "#5EAFC6");

    fs.writeFile('output.svg', document.body.innerHTML, (err) => {
        if (err) throw err;
        console.log('save successful!');
    });
});
