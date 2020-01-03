// Practicing with concepts from a couple of blog posts concerning async and await.
// https://codeburst.io/async-patterns-in-node-js-only-4-different-ways-to-do-it-70186ee83250?gi=38693e20e33c

// https://blog.bitsrc.io/understanding-javascript-async-and-await-with-examples-a010b03926ea
const fs = require('fs')
function getFileContents(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile('hello.txt', 'utf-8', (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

// https://stackoverflow.com/a/41957152
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

// Call and use .then and .catch to operate on the returned promise
getFileContents('hello.txt').then(data => {
    console.log('File contents:', data)
}).catch(err => {
    console.error("Error reading file:", err)
})

// async version
async function showFileContents() {
    console.log('Ima try an open this bad boy')
    try {
        let data = await getFileContents('hello.txt')
        console.log('File contents (data):', data)
        await sleep(1000)
        let bonusData = await getFileContents('hello.txt')
        console.log('File contents (bonusData):', bonusData)
        console.log('This runs after both awaits have returned!')
    }
    catch (err) {
        console.error('shwoopsie!', err)
    }
}

console.log('Let\'s do this! Calling showFileContents')
showFileContents()
console.log('Just below showFileContents call now')
