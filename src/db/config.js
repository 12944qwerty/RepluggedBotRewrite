import { readFile } from 'fs/promises';

const path = './src/config.json';

export async function readJSON() {
    return JSON.parse(await readFile(path, 'utf-8'));
}

export async function getSetting(setting) {
    const config = await readJSON();
    return config[setting];
}