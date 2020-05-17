
// const fs = require('fs');
// const path = require('path');
const request = require('request');

// const ca = fs.readFileSync(path.join(__dirname, 'certs', 'client', 'chain.pem'));
const port = process.argv[2] || 443;
const hostname = process.argv[3] || 'schemastore.azurewebsites.net';

const options = {
    url: `https://${hostname}:${port}`,
    // , agentOptions: {
    // ca: ca
    // }
};

console.log(`About to make a request to ${options.url} to see if we have self-signed cert issues...`);

request.get(options, (err, resp) => {
    console.log('request made, checking');
    if (err) {
        console.log(err);
        console.log('yep, we got errors...');
    } else {
        console.log(resp.body);
        console.log('nope, we good!');
    }
    console.log('request complete');
});
