// Experimenting with promises, examples from https://tech.io/playgrounds/6730/i-promise-i-wont-callback-anymore

const fs = require('fs')

// Get the promisify method from the util module
const { promisify } = require('util')

// Promisify our readFile and writeFile function
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

writeFile('original.txt', 'Promise me you will clone me!')
    .then(() => readFile('original.txt', 'utf-8'))
    .then(content => writeFile('clone.txt', content))
    .then(() => readFile('clone.txt', 'utf-8'))
    .then(cloneContent => console.log(cloneContent))
    .catch(err => console.log('Error occurred:', err))


// Promise me you will clone me!
