// d3.jsの表示テスト
const d3 = Object.assign({}, require("d3"), require("d3-geo"), require("d3-queue"));
const jsdom = require("jsdom");
const fs = require("fs");
const simplify = require('simplify-geojson');
const { JSDOM } = jsdom;

const document = new JSDOM(``).window.document;

var width = 1920,
    height = 1080;
var scale = 15000;
var center = [139.4257, 35.4011];

const q = d3.queue()
    .defer(fs.readFile, 'japan_geojson/land/japan.geojson');

q.await((err, files) => {
    if (err) throw err;
    var data = JSON.parse(files);
    data = simplify(data, 0.02);

    var aProjection = d3.geoMercator()
        .center(center)
        .translate([width / 2, height / 2])
        .scale(scale);


    var geoPath = d3.geoPath()
        .projection(aProjection);

    var svg = d3.select(document.body)
        .append('svg')
        .attr("xmlns", 'http://www.w3.org/2000/svg')
        .attr("width", width)
        .attr("height", height)
        .attr("xmin", aProjection.invert([0, 0])[0])
        .attr("xmax", aProjection.invert([width, height])[0])
        .attr("ymin", aProjection.invert([width, height])[1])
        .attr("ymax", aProjection.invert([0, 0])[1])
        .attr("scale", aProjection.scale())
        .style('background-color', "#1a1a1a");

    //マップ描画
    svg.append("path")
        .datum(data)
        .attr("d", geoPath)
        .attr("fill", "#595959")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");


    fs.writeFile('output.svg', document.body.innerHTML, (err) => {
        if (err) throw err;
        console.log('save successful!');
    });
});
