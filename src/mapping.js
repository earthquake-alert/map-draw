// -----------------------------------------
// @author: Yuto Watanabe
//
// Copyright (c) 2020 Earthquake alert
// -----------------------------------------

// --- Read module ---
const commandLineArgs = require('command-line-args');
const d3 = Object.assign({}, require('d3'), require('d3-geo'), require('d3-queue'));
const fs = require('fs');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const document = new JSDOM(`<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap" rel="stylesheet">`).window.document;


// --- Read args ---
const optionDefinitions = [
    { name: 'output', alias: 'o', type: String },
    { name: 'input', alias: 'i', type: String }
]
const options = commandLineArgs(optionDefinitions)

// ---Read config file ---
config = JSON.parse(fs.readFileSync('config/config.json'));

// --- Setting ---
const area_info = JSON.parse(fs.readFileSync(options.input));     // Epicenter, area and its depth.
const save_path = options.output;                                 // The path to save.
const width = config.width;                                       // Image width.
const height = config.height;                                     // Image height.
const def_scale = config.scale;                                   // The magnification of the map.
const sea_color = config.sea_color;                               // Sea color.
const land_color = config.land_color;                             // Land color.
const stroke_color = config.stroke_color;                         // Stroke color.
const map = config.map;                                           // The map path in geojson format to use.
const seismic_intensity_color = config.seismic_intensity_color;   // Seismic intensity color.
const epicenter_config = config.epicenter;                        // Epicenter drawing settings.
const seismic_intensity_config = config.seismic_intensity;        // Seismic intensity drawing settings.

const epicenter = area_info.epicenter;                            // epicenter. [ longitude, latitude ]



// --- Read geojson(map) file ---
const q = d3.queue()
    .defer(fs.readFile, map);

q.awaitAll((err, files) => {
    if (err) throw err;
    var data = JSON.parse(files);


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
        .attr('x1', center[0] - epicenter_config.size)
        .attr('x2', center[0] + epicenter_config.size)
        .attr('y1', center[1] - epicenter_config.size)
        .attr('y2', center[1] + epicenter_config.size)
        .attr('stroke-width', epicenter_config.stroke_width)
        .style('stroke', epicenter_config.color);

    svg.append('line')
        .attr('x1', center[0] - epicenter_config.size)
        .attr('x2', center[0] + epicenter_config.size)
        .attr('y1', center[1] + epicenter_config.size)
        .attr('y2', center[1] - epicenter_config.size)
        .attr('stroke-width', epicenter_config.stroke_width)
        .style('stroke', epicenter_config.color);


    // --- Seismic intensity of each place ---
    const Export = (area, color, text) => {
        coordinate = aProjection(area)
        svg.append('circle')
            .attr('r', seismic_intensity_config.circle)
            .attr('cx', coordinate[0])
            .attr('cy', coordinate[1])
            .style('fill', color);

        svg.append('text')
            .text(text)
            .attr('x', coordinate[0] + seismic_intensity_config.width)
            .attr('y', coordinate[1] + seismic_intensity_config.height)
            .attr('font-size', seismic_intensity_config.fontsize)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'monospace');
    };

    // Seismic intensity 0
    if (area_info.areas['0']) {
        color = seismic_intensity_color['0']
        text = '0'
        for (let area of area_info.areas['0']) {
            Export(area, color, text);
        }

    }
    // Seismic intensity 1
    if (area_info.areas['1']) {
        color = seismic_intensity_color['1']
        text = '1'
        for (let area of area_info.areas['1']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 2
    if (area_info.areas['2']) {
        color = seismic_intensity_color['2']
        text = '2'
        for (let area of area_info.areas['2']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 3
    if (area_info.areas['3']) {
        color = seismic_intensity_color['3']
        text = '3'
        for (let area of area_info.areas['3']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 4
    if (area_info.areas['4']) {
        color = seismic_intensity_color['4']
        text = '4'
        for (let area of area_info.areas['4']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 5-
    if (area_info.areas['under_5']) {
        color = seismic_intensity_color['under_5']
        text = '5-'
        for (let area of area_info.areas['inder_5']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 5+
    if (area_info.areas['over_5']) {
        color = seismic_intensity_color['over_5']
        text = '5+'
        for (let area of area_info.areas['over_5']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 6-
    if (area_info.areas['under_6']) {
        color = seismic_intensity_color['under_6']
        text = '6-'
        for (let area of area_info.areas['under_6']) {
            Export(area, color, text);
        }
    }

    // Seismic intensity 6+
    if (area_info.areas['over_6']) {
        color = seismic_intensity_color['over_6']
        text = '6+'
        for (let area of area_info.areas['over_6']) {
            Export(area, color, text);
        }
    }
    // Seismic intensity 7
    if (area_info.areas['7']) {
        color = seismic_intensity_color['7']
        text = '7'
        for (let area of area_info.areas['7']) {
            Export(area, color, text);
        }
    }

    // --- Save SVG file ----
    fs.writeFile(save_path, document.body.innerHTML, (err) => {
        if (err) throw err;
        console.log('save successful!');
    });
})
