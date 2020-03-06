// Simple app that prints environment info
const os = require('os');

const platform = os.platform();

console.log(`Hello from hostname:${os.hostname()}, platform:${platform}, release:${os.release()}, arch:${os.arch()}, node runtime version:${process.version}`);

if (os.release().includes('linuxkit')) { console.log('Hello from container land! 🐳'); }

console.log('See ya!');
