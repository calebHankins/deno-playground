const https = require('https');

// const ca = fs.readFileSync(path.join(__dirname, 'certs', 'client', 'chain.pem'));
const port = process.argv[2] || 443;
const hostname = process.argv[3] || 'schemastore.azurewebsites.net';

const options = {
    hostname,
    port,
    path: '/',
    method: 'GET',
    // , ca: ca
};

console.log(`About to make a request to https://${hostname}:${port} to see if we have self-signed cert issues...`);

const req = https.request(options, (res) => {
    console.log('request made, checking');
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (err) => {
    console.error(err);
    console.log('yep, we got errors...');
    process.exit(1); // exit with non-zero code
});

req.on('close', () => {
    console.log('');
    console.log('nope, we good!');
    console.log('request complete');
});

req.end();
