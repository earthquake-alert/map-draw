// -----------------------------------------
// @author: Yuto Watanabe
//
// Copyright (c) 2020 Earthquake alert
// -----------------------------------------

// --- Read module ---
const commandLineArgs = require('command-line-args');
const d3 = Object.assign({}, require('d3'), require('d3-geo'), require('d3-queue'));
const fs = require('fs');
const simplify = require('simplify-geojson');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const document = new JSDOM(``).window.document;


// --- Read args ---
const optionDefinitions = [
    { name: 'output', alias: 'o', type: String },
    { name: 'input', alias: 'i', type: String }
]
const options = commandLineArgs(optionDefinitions)

// ---Read config file ---
config = JSON.parse(fs.readFileSync('config/config.json'));

// --- Setting ---
const area_info = JSON.parse(fs.readFileSync(options.input)); // Epicenter, area and its depth.
const save_path = options.output;                             // The path to save.
const width = config.width;                                   // Image width.
const height = config.height;                                 // Image height.
const def_scale = config.scale;                               // The magnification of the map.
const sea_color = config.sea_color;                           // Sea color.
const land_color = config.land_color;                         // Land color.
const stroke_color = config.stroke_color;                     // Stroke color.
const map = config.map;                                       // The map path in geojson format to use.

const epicenter = area_info.epicenter;                        // epicenter. [ longitude, latitude ]


// --- Read geojson(map) file ---
const q = d3.queue()
    .defer(fs.readFile, map);

q.awaitAll((err, files) => {
    if (err) throw err;
    var data = JSON.parse(files);
    data = simplify(data, (100 / def_scale));


    // --- Adjust the drawing position ---
    var aProjection = d3.geoMercator()
        .center(epicenter)
        .translate([width / 2, height / 2])
        .scale(def_scale);

    var geoPath = d3.geoPath()
        .projection(aProjection);

    // --- SVG settings ---
    var svg = d3.select(document.body)
        .append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', width)
        .attr('height', height)
        .attr('xmin', aProjection.invert([0, 0])[0])
        .attr('xmax', aProjection.invert([width, height])[0])
        .attr('ymin', aProjection.invert([width, height])[1])
        .attr('ymax', aProjection.invert([0, 0])[1])
        .attr('scale', aProjection.scale())
        .style('background-color', sea_color);

    // --- Map drawing ---
    svg.append('path')
        .datum(data)
        .attr('d', geoPath)
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .style('fill', land_color)
        .style('stroke', stroke_color);

    // -- epicenter --
    center = aProjection(epicenter)
    svg.append('line')
        .attr('x1', center[0] - 20)
        .attr('x2', center[0] + 20)
        .attr('y1', center[1] - 20)
        .attr('y2', center[1] + 20)
        .attr('stroke-width', 10)
        .style('stroke', '#eb3b3b');

    svg.append('line')
        .attr('x1', center[0] - 20)
        .attr('x2', center[0] + 20)
        .attr('y1', center[1] + 20)
        .attr('y2', center[1] - 20)
        .attr('stroke-width', 10)
        .style('stroke', '#eb3b3b');




    // --- Save SVG file ----
    fs.writeFile(save_path, document.body.innerHTML, (err) => {
        if (err) throw err;
        console.log('save successful!');
    });
})
