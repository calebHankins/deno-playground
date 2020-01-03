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
    .then(content => ini.parse(content))
    .then(config => {
        console.log(`Here's our config object before we mess with it:\n` + ini.stringify(config))
        return config // return this so we can keep using it
    })
    // .then(async config => {
    .then(config => {
        // update existing config
        config.database.database = 'use_another_database'
        config.paths.default.tmpdir = '/tmp'
        delete config.paths.default.dataDir
        config.paths.default.array.push('fourth value')

        // need to be in an async func to use await
        // don't use async unless I need it to avoid wrapper overhead
        // await sleep(2000)
        sleep(2000).then(() => 1)

        // add a new section
        config.KingKnowledge = {}
        config.KingKnowledge.SwallowType = 'European'
        config.KingKnowledge.LoadBearing = false
        config.KingKnowledge.AirspeedVelocity = '24 mi/hr'
        return config
    })
    .then(config => {
        console.log(`Here's our config object after we mess with it:\n` + ini.stringify(config))
        return config // return this so we can keep using it
    })
    .then(config => writeFile('./config_modified.ini', ini.stringify(config)))
    .catch(err => console.log('Error occurred:', err))

console.log('1')
sleep(4000)
    .then(() => console.log('4'))
aSleep(3000)
console.log('2')
const goodBoySleeping = (secs) => goodBoy(secs)
goodBoySleeping(0)


// https://stackoverflow.com/a/41957152
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function aSleep(ms) {
    await sleep(ms)
    // await goodBoy()
    goodBoy(7)
    console.log((ms / 1000).toString())
}



function goodBoy (secs) {
    sleep(secs * 1000).then(() => console.log(`Who's a good boy?`))
}
