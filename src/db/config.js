import { readFile } from 'fs/promises';

/**
 * The path to the config file
 * @type {string}
 */
const path = './src/config.json';

/** This function just returns the parsed JSON
 * @returns {Promise<Object>} The parsed JSON
 * @async
 */
export async function readJSON() {
    return JSON.parse(await readFile(path, 'utf-8'));
}


/** This function returns the value of a setting
 * @param {string} setting The setting to get
 * @returns {Promise<any>} The value of the setting
 * @async
 */
export async function getSetting(setting) {
    const config = await readJSON();
    return config[setting];
}