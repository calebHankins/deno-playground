const fs = require('fs');
const path = require('path');
const targetFileList = require('./lib/init').containerInit.sshFileList;
const targetSSHFolderEnv = require('./lib/init').containerInit.sshFolderRemote;

const {
    readdir,
    copyFile: fsCopy,
    stat: fsStat,
    chmod: fsChmod,
    mkdir,
} = fs.promises;

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
            // Normalize tempSSHFolder to forward slashes and insert separator when a Windows drive
            // is concatenated right after the target folder (e.g. '/root/.sshC:/Users/...')
            const original = tempSSHFolder;
            const forwardSlashes = original.replace(/\\+/g, '/');
            const collapsedSlashes = forwardSlashes.replace(/\/+/g, '/');
            // candidate with separator inserted before a Windows drive (C:/...)
            let insertedSeparator = collapsedSlashes;
            try {
                const escapedTarget = targetSSHFolder.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                insertedSeparator = collapsedSlashes.replace(new RegExp(`${escapedTarget}(?=[A-Za-z]:)`), `${targetSSHFolder}/`);
            } catch (err) {
                insertedSeparator = collapsedSlashes;
            }
            const rawCandidates = [
                original,
                forwardSlashes,
                collapsedSlashes,
                insertedSeparator,
            ];
            const candidates = rawCandidates.map((c) => path.normalize(c));
            let normalizedTemp = null;
            const foundCandidates = await Promise.all(candidates.map(async (candidate) => {
                try {
                    const s = await fsStat(candidate);
                    if (s && s.isDirectory()) return candidate;
                } catch (e) {
                    // ignore
                }
                return null;
            }));
            normalizedTemp = foundCandidates.find((c) => !!c) || null;
            // final fallback: use original string normalized regardless of existence
            if (!normalizedTemp) {
                normalizedTemp = path.normalize(collapsedSlashes);
            }
            normalizedTemp = path.normalize(normalizedTemp);
            console.log(`normalized ssh temp folder: ${normalizedTemp}`);
            // make the target folder if it doesn't exist
            // create the target folder if it doesn't exist and set the permissions to 0700
            await mkdir(targetSSHFolder, { recursive: true, mode: 0o700 });

            // copy files over an set appropriate permissions
            const allFiles = await readdir(normalizedTemp);
            console.log(allFiles);
            const filteredFiles = allFiles.filter((file) => targetFiles.includes(file));
            console.log(filteredFiles);

            // copy files over to the target dir and set the appropriate mode
            const tasks = filteredFiles.map(async (file) => {
                try {
                    const sourceFullPath = path.join(normalizedTemp, file);
                    const targetFullPath = path.join(targetSSHFolder, file);
                    const sourceStat = await fsStat(sourceFullPath);
                    if (sourceStat.isDirectory()) {
                        console.log(`Skipping directory ${sourceFullPath}`);
                        return;
                    }
                    console.log(`Copying ${sourceFullPath} to ${targetFullPath}`);
                    await fsCopy(sourceFullPath, targetFullPath);
                    await fsChmod(targetFullPath, 0o600);
                    const statAfterUpdate = await fsStat(targetFullPath);
                    // eslint-disable-next-line no-bitwise
                    const unixFilePermissionsAfterUpdate = `0${(statAfterUpdate.mode & 0o777).toString(8)}`;
                    console.log(`${targetFullPath}'s unix permissions after update: ${unixFilePermissionsAfterUpdate}`);
                } catch (err) {
                    console.error(err);
                }
            });
            await Promise.all(tasks);
        } else {
            console.log('ssh temp and target folder are the same or temp folder not set, skipping copy');
        }
    } catch (err) {
        console.log(err);
    }
}

copySSHFiles(tempSSHFolderEnv, targetSSHFolderEnv, targetFileList);
