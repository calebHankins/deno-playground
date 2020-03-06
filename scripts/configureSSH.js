const fs = require('fs');
const mkdirp = require('mkdirp');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const fsCopy = promisify(fs.copyFile);
const fsStat = promisify(fs.stat);
const fsChmod = promisify(fs.chmod);
const targetSSHFolderEnv = '/root/.ssh';
const tempSSHFolderEnv = process.env.SSH_TEMP_FOLDER_NAME;
console.log(`ssh folder detected as: ${targetSSHFolderEnv}`);
console.log(`ssh temp folder detected as: ${tempSSHFolderEnv}`);

/**
 * copySSHFiles from staging folder to final folder. Lock down permissions to allow git to function.
 * @param {string} tempSSHFolder - Staging folder where ssh file currently reside.
 * @param {string} targetSSHFolder - Final folder for ssh files
 * @param {string[]} targetFiles - White list of files to operate on
 * @returns {void}
 */
async function copySSHFiles(tempSSHFolder, targetSSHFolder, targetFiles) {
    try {
        // only attempt to configure ssh if we were given a tempSSHFolder and it is not the same as the final ssh folder
        if (tempSSHFolder && tempSSHFolder !== targetSSHFolder) {
            console.log(`copying ssh files from ${tempSSHFolder} to ${targetSSHFolder}`);
            // make the target folder if it doesn't exist
            const mkdirpOptions = {
                mode: '700',
            };
            await mkdirp(targetSSHFolder, mkdirpOptions);

            // copy files over an set appropriate permissions
            const allFiles = await readdir(tempSSHFolder);
            console.log(allFiles);
            const filteredFiles = allFiles.filter((file) => targetFiles.includes(file));
            console.log(filteredFiles);

            // copy files over to the target dir and set the appropriate mode
            filteredFiles.forEach(async (file) => {
                try {
                    const sourceFullPath = `${tempSSHFolder}/${file}`;
                    const targetFullPath = `${targetSSHFolder}/${file}`;
                    console.log(`Copying ${sourceFullPath} to ${targetFullPath}`);
                    await fsCopy(sourceFullPath, targetFullPath);
                    await fsChmod(targetFullPath, '0600');
                    const statAfterUpdate = await fsStat(targetFullPath);
                    const unixFilePermissionsAfterUpdate = `0${(statAfterUpdate.mode).toString(8)}`;
                    console.log(`${targetFullPath}'s unix permissions after update: ${unixFilePermissionsAfterUpdate}`);
                } catch (err) {
                    console.error(err);
                }
            });
        } else {
            console.log('ssh temp and target folder are the same or temp folder not set, skipping copy');
        }
    } catch (err) {
        console.log(err);
    }
}

const targetFiles = ['id_rsa', 'config', 'known_hosts', 'id_rsa.pub', 'authorized_keys'];
copySSHFiles(tempSSHFolderEnv, targetSSHFolderEnv, targetFiles);
