/* eslint-disable no-param-reassign */
/* eslint-disable require-jsdoc */
// Messing around with the ini package (https://www.npmjs.com/package/ini)

const fs = require('fs');
const ini = require('ini');
const { promisify } = require('util');

// Get optional filenames from cli
const configFileName = process.argv[2] ? process.argv[2] : './config.ini';
const configFileNameModified = process.argv[3] ? process.argv[3] : './config_modified.ini';

// promisify callback based calls
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function updateConfigFile(sourceFile, modifiedFile) {
    try {
        const content = await readFile(sourceFile, 'utf-8');
        console.log(`Here's what we got for input:\n${content}`);
        const config = ini.parse(content);
        console.log(`Here's our config object before we mess with it:\n${ini.stringify(config)}`);
        updateConfig(config);
        console.log(`Here's our config object after we mess with it:\n${ini.stringify(config)}`);
        writeFile(modifiedFile, ini.stringify(config));
    } catch (err) {
        console.error(`try/catch error caught:${err}`);
    }
}

async function updateConfig(config) {
    // update existing config
    config.database.database = 'use_another_database';
    config.paths.default.tmpdir = '/tmp';
    delete config.paths.default.dataDir;
    config.paths.default.array.push('fourth value');

    // add a new section
    config.KingKnowledge = {};
    config.KingKnowledge.SwallowType = 'European';
    config.KingKnowledge.LoadBearing = false;
    config.KingKnowledge.AirspeedVelocity = '24 mi/hr';
}

updateConfigFile(configFileName, configFileNameModified);
