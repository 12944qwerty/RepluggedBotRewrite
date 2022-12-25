import { slashCommandData } from '../indexer/slash.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { config } from 'dotenv';
import { getSetting } from '../db/config.js';
config();

/** The test guild ID
 * @type {string}
 */
const guildID = await getSetting('DevGuildID');
/** The bot ID
 * @type {string}
 */
const clientID = await getSetting('BotID');
/** Whether or not the bot is in dev mode
 * @type {boolean}
 */
const devMode = await getSetting('DevMode');
/** The Discord REST API
 * @type {REST}
 */
const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

/**
 * This function pushes the slash commands to Discord
 * @returns {Promise<void>} Nothing
 * @async
 */
export async function pushCommands() {
    if (slashCommandData.length === 0) {
        console.log('[Slash Command Pusher]: No commands to push!');
    } else {
        try {
            console.log(`[Slash Command Pusher]: Attempting to push ${slashCommandData.length} commands to Discord.`);
            if (devMode) {
                console.log(`[Slash Command Pusher]: Pushing commands to guild: ${guildID}`);
                await restAPI.put(Routes.applicationGuildCommands(clientID, guildID), { body: slashCommandData });
            } else {
                console.log('[Slash Command Pusher]: Pushing commands to global scope.');
                await restAPI.put(Routes.applicationCommands(clientID), { body: slashCommandData });
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log(`[Slash Command Pusher]: Successfully pushed ${slashCommandData.length} commands to Discord.`);
        }
    }
}