var d3 = require("d3");
const { JSDOM } = require('jsdom')
const document = new JSDOM().window.document

var svg = d3.select(document.body)
    .append("svg");

console.log(document.body.innerHTML);
