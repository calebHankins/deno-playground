// Messing around with the ini package (https://www.npmjs.com/package/ini)

const fs = require('fs')
    , ini = require('ini')
const { promisify } = require('util')

// promisify callback based calls
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Todo, can we convert these to be async/await with promises?
const iniParse = ini.parse
const iniStringify = ini.stringify

readFile('./config.ini', 'utf-8')
    .then(content => {
        console.log(`Here's what we got for input:\n${content}`)
        return content // return this so we can keep using it
    })
    .then(content => iniParse(content))
    .then(config => {
        console.log(`Here's our config object before we mess with it:\n` + iniStringify(config))
        return config // return this so we can keep using it
    })
    .then(config => {
        // update existing config
        config.database.database = 'use_another_database'
        config.paths.default.tmpdir = '/tmp'
        delete config.paths.default.dataDir
        config.paths.default.array.push('fourth value')

        // add a new section
        config.KingKnowledge = {}
        config.KingKnowledge.SwallowType = 'European'
        config.KingKnowledge.LoadBearing = false
        config.KingKnowledge.AirspeedVelocity = '24 mi/hr'
        return config
    })
    .then(config => {
        console.log(`Here's our config object after we mess with it:\n` + iniStringify(config))
        return config // return this so we can keep using it
    })
    .then(config => writeFile('./config_modified.ini', iniStringify(config)))
    .catch(err => console.log('Error occurred:', err))
