import { slashCommandData } from '../indexer/slash.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { config } from 'dotenv';
import { getSetting } from '../db/config.js';
config();

const guildID = await getSetting('DevGuildID');
const clientID = await getSetting('BotID');
const devMode = await getSetting('DevMode');

const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

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