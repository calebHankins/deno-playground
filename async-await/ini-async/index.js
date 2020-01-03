// refactor of ini-promise-chain with async function instead of promise chain
const configFileName =
    process.argv[2] ? process.argv[2] : './config.ini'
const configFileNameModified =
    process.argv[3] ? process.argv[3] : './config_modified.ini'

const fs = require('fs')
    , ini = require('ini')
const { promisify } = require('util')

// promisify callback based calls
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function updateConfigFile(configFileName, configFileNameModified) {
    try {
        const content = await readFile(configFileName, 'utf-8')
        console.log(`Here's what we got for input:\n${content}`)
        const config = ini.parse(content)
        console.log(`Here's our config object before we mess with it:\n` + ini.stringify(config))
        updateConfig(config)
        console.log(`Here's our config object after we mess with it:\n` + ini.stringify(config))
        writeFile(configFileNameModified, ini.stringify(config))

    } catch (err) {
        console.error('try/catch error caught:' + err)
    }
}

async function updateConfig(config) {
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

}

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

function goodBoy(secs) {
    sleep(secs * 1000).then(() => console.log(`Who's a good boy?`))
}

updateConfigFile(configFileName, configFileNameModified)
console.log('1')
sleep(4000)
    .then(() => console.log('4'))
aSleep(3000)
console.log('2')
const goodBoySleeping = (secs) => goodBoy(secs)
goodBoySleeping(0)
