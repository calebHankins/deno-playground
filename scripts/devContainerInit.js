// Init Jankins config. Create stubs for any devcontainer mount targets so the startup won't fail.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');
const { parse } = require('comment-json'); // read jsonc files
const targetFileList = require('./lib/init').containerInit.sshFileList;

const fsp = fs.promises;

const fsReadFile = promisify(fs.readFile);

// eslint-disable-next-line no-template-curly-in-string
const nixHome = '${env:HOME}';

// eslint-disable-next-line no-template-curly-in-string
const winHome = '${env:USERPROFILE}';

const scriptName = path.basename(__filename);
console.log(`${scriptName} starting.`);

// Figure out what's passing as our home directory for this run
const homeDirDerivation = process.env.HOME_OVERRIDE ? process.env.HOME_OVERRIDE : os.homedir();
console.log(`${scriptName} home detected as: ${homeDirDerivation}`);

/**
 * @returns {Object} The devcontainer.json file's parsed jsonc content
 * @desc Load and return the remote-container config file as a parsed jsonc object
 */
async function devContainerConfig() {
    const cwd = process.cwd();
    console.log(`${scriptName} cwd detected as: ${cwd}`);
    const configRaw = await fsReadFile(`${cwd}/.devcontainer/devcontainer.json`);
    const config = await parse(configRaw.toString()); // jsonc file

    return config;
}

/**
 *
 * @param {String} codeString - string that may need vscode vars interpolated
 * @returns {String} interpolatedCodeString
 * @desc  If a string contains 1 or both of ${env:HOME} or ${env:USERPROFILE}. Replace with the homeDirDerivation.
 */
function interpolateCodePlaceholders(codeString) {
    let interpolatedCodeString = codeString;

    if (codeString.includes(`${nixHome}${winHome}`)) {
        interpolatedCodeString = codeString.replace(`${nixHome}${winHome}`, homeDirDerivation);
    } else if (codeString.includes(`${winHome}${nixHome}`)) {
        interpolatedCodeString = codeString.replace(`${winHome}${nixHome}`, homeDirDerivation);
    } else if (codeString.includes(`${nixHome}`)) {
        interpolatedCodeString = codeString.replace(`${nixHome}`, homeDirDerivation);
    } else if (codeString.includes(`${winHome}`)) {
        interpolatedCodeString = codeString.replace(`${winHome}`, homeDirDerivation);
    }

    return interpolatedCodeString;
}

/**
 *
 * @param {Object} paths - an object with at least a 'mkdirpList' and a 'touchList' array
 * @returns {void}
 * @desc Creates paths and files if they are missing
 */
async function taTaTaTaTouchMe(paths) {
    console.log(`${scriptName} attempting to mkdirp and touch these guys:`);
    console.log(paths);

    // Create directories (if they don't exist already)
    // Need to have these complete before trying to touch
    // Which is kind of non-intuitive as it turns out
    // map is going to return an array of promises, need them complete before we can continue
    // @see https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
    await Promise.all(paths.mkdirpList.map(async (dir) => {
        console.log(`${scriptName} mkdirp'ing: [${dir}]`);
        try {
            await fsp.mkdir(dir, { recursive: true, mode: 0o700 });
        } catch (e) {
            console.error(`${scriptName} ${e} ❌`);
        }
    }));

    // Create files (if they don't exist already)
    await Promise.all(paths.touchList.map(async (touchMe) => {
        console.log(`${scriptName} touching: [${touchMe}]`);
        try {
            await fsp.mkdir(path.dirname(touchMe), { recursive: true, mode: 0o700 });
            const handle = await fsp.open(touchMe, 'a');
            await handle.close();
        } catch (e) {
            console.error(`${scriptName} ${e} ❌`);
        }
    }));

    console.log(`${scriptName} mkdirp and touch complete!`);
}

/**
 * @returns {void}
 */
async function run() {
    try {
        const devCon = await devContainerConfig();

        // runArgs
        const { runArgs } = devCon;
        if (runArgs) {
            console.log(`${scriptName} devContainer's runArgs scan: started. 🔍`);
            const runPaths = runArgsPaths(runArgs);
            console.log(`${scriptName} devContainer's runArgs scan: complete. ✔️`);
            await taTaTaTaTouchMe(runPaths);
        }

        // mounts
        const { mounts } = devCon;
        if (mounts) {
            console.log(`${scriptName} devContainer's mounts scan: started. 🔍`);
            const bindPaths = bindMountPaths(mounts);
            console.log(`${scriptName} devContainer's mounts scan: complete. ✔️`);
            await taTaTaTaTouchMe(bindPaths);
        }

        console.log(`${scriptName} complete! 💚`);
    } catch (e) {
        console.error(`${scriptName} ${e} 💔`);
    }
}

/**
 *
 * @param {String[]} runArgs - array of runArgs from the devcontainer config
 * @returns {Object} paths - object containing two String[] of interpolated paths: {mkdirpList, touchList}
 */
function runArgsPaths(runArgs) {
    const paths = runArgs.filter((arg) => arg.includes(nixHome) || arg.includes(winHome));
    const interpolatedPaths = paths.map((value) => interpolateCodePlaceholders(value));
    const dirsThatContainFile = interpolatedPaths.map((iv) => iv.split('/').slice(0, -1).join('/'));
    const mkdirpList = Array.from(new Set(dirsThatContainFile)); // Get a unique array
    const touchList = Array.from(new Set(interpolatedPaths)); // Get a unique array
    return { mkdirpList, touchList };
}

/**
 *
 * @param {String[]} mounts - array of mounts from the devcontainer config
 * @returns {Object} paths - object containing two String[] of interpolated paths: {mkdirpList, touchList}
 */
function bindMountPaths(mounts) {
    // Filer to just bind mounts
    const bindMounts = mounts.filter((mount) => mount.includes('type=bind'));

    // Strip off sources of bind mounts, need to make sure they exist on the host OS
    const bindMountKeyValuePairs = bindMounts.map((mount) => mount.split(',')); // these are comma delimited key=value pairs

    // For these, filter to just 'source' keys
    const sourceKeyValuePairs = bindMountKeyValuePairs.map((bindMount) => bindMount.filter((key) => key.includes('source')));

    // Now strip down to only the values
    const sourceKeyValues = sourceKeyValuePairs.map((pair) => pair[0].split('=')[1]);

    // Sub in vscode home env vars with our calculated homeDirDerivation
    const interpolatedSourceKeyValues = sourceKeyValues.map((value) => interpolateCodePlaceholders(value));

    // Split these into folders and folders + files
    const pathsWithFile = interpolatedSourceKeyValues.filter((iv) => targetFileList.includes(iv.split('/').pop()));

    // Create a list of folders for the pathsWithFile
    const dirsThatContainFile = pathsWithFile.map((iv) => iv.split('/').slice(0, -1).join('/'));

    // Everything not flagged as a path with a file on the end, stick in this array
    const pathsWithoutFile = interpolatedSourceKeyValues.filter((iv) => !(pathsWithFile.includes(iv)));

    const mkdirpList = Array.from(new Set(pathsWithoutFile.concat(dirsThatContainFile))); // Get a unique array
    const touchList = Array.from(new Set(pathsWithFile)); // Get a unique array

    return { mkdirpList, touchList };
}

run();
