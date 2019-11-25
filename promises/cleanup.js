// Experimenting with promises, examples based on https://tech.io/playgrounds/6730/i-promise-i-wont-callback-anymore

const fs = require('fs')

// Get the promisify method from the util module
const { promisify } = require('util')

// Promisify unlink function
const unlinkFile = promisify(fs.unlink)

// cleanup files we created in index.js
unlinkFile('clone.txt')
.then(() => console.log('clone.txt unlinked!'))
.catch((err) => console.error('Error occurred during unlink:', err))
.then(() => unlinkFile('original.txt'))
.then(() => console.log('original.txt unlinked!'))
.catch((err) => console.error('Error occurred during unlink:', err))
