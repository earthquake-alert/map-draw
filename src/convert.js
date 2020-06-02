/*
* @author: Yuto Watanabe
* @version: 1.0.0
*
* Copyright (c) 2020 Earthquake alert
*/

const commandLineArgs = require('command-line-args');
const { convertFile } = require('convert-svg-to-png');

const optionDefinitions = [
    { name: 'output', alias: 'o', type: String },
    { name: 'input', alias: 'i', type: String }
]

const option = commandLineArgs(optionDefinitions);

(async () => {
    convertFile(inputFilePath = option.input, { 'outputFilePath': option.output });

    console.log('save successful! ' + option.output);
})();
