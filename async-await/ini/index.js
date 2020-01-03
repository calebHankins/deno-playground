// Messing around with the ini package (https://www.npmjs.com/package/ini)

const fs = require('fs')
    , ini = require('ini')
const { promisify } = require('util')

// promisify callback based calls
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)


readFile('./config.ini', 'utf-8')
    .then(content => {
        console.log(`Here's what we got for input:\n${content}`)
        return content // return this so we can keep using it
    })
    .then(async content => ini.parse(content))
    .then(async config => {
        console.log(`Here's our config object before we mess with it:\n` + ini.stringify(config))
        return config // return this so we can keep using it
    })
    .then(async config => {
        // update existing config
        config.database.database = 'use_another_database'
        config.paths.default.tmpdir = '/tmp'
        delete config.paths.default.dataDir
        config.paths.default.array.push('fourth value')

        await sleep(2000)

        // add a new section
        config.KingKnowledge = {}
        config.KingKnowledge.SwallowType = 'European'
        config.KingKnowledge.LoadBearing = false
        config.KingKnowledge.AirspeedVelocity = '24 mi/hr'
        return config
    })
    .then(async config => {
        console.log(`Here's our config object after we mess with it:\n` + ini.stringify(config))
        return config // return this so we can keep using it
    })
    .then(async config => writeFile('./config_modified.ini', ini.stringify(config)))
    .catch(err => console.log('Error occurred:', err))

console.log('1')
sleep(5000)
    .then( () => console.log('3'))
console.log('2')


// https://stackoverflow.com/a/41957152
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
