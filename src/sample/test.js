var simplify = require('simplify-geojson');
const fs = require("fs");


geojson = JSON.parse(fs.readFileSync('japan_geojson/land/japan.geojson'));
var simplified = simplify(geojson, 0.1);

console.log(simplified);
