import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';
import lightercolors from 'lighter-colors';

config();

const bot = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Ready Event

bot.once(Events.ClientReady, () => {
    console.log(
        `[Info]: Connected To Discord!\n[Info]:\tGuild Count: ${bot.guilds.cache.size}\n[Info]:\tMy ID: ${bot.user?.id}`.green,
    );
});


// Slash Command Indexer ******************************************************

import { indexSlashCommands } from './indexer/slash.js';
await indexSlashCommands();

// Push Slash Commands To Discord *********************************************

import { pushCommands } from './lib/pushCommands.js';
await pushCommands();

// Interaction Handler ********************************************************

import { handleInteraction } from './handler/interaction.js';
bot.on(Events.InteractionCreate, async interaction => {
    await handleInteraction(interaction, bot);
})

// Other Events ***************************************************************

bot.on(Events.Error, console.error);
bot.on(Events.Warn, console.warn);
bot.on(Events.Invalidated, () => {
    console.log('[Info]: Session invalidated!');
    bot.destroy();
    process.exit(1);
});

// Login **********************************************************************

bot.login(process.env.DISCORD_TOKEN);
