import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

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
        `[Info]: Connected To Discord!\n[Info]:\tGuild Count: ${bot.guilds.cache.size}\n[Info]:\tMy ID: ${bot.user?.id}`,
    );
});

// DB Connection ***************************************************************

Promise.resolve(new MongoClient(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}`))
    .then(client => client.connect())
    .then(client => bot.mango = client.db(process.env.MONGO_DB))
    .catch((e) => console.error(`[MongoDB]: ${e}`));



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
});

// Other Events ***************************************************************

bot.on(Events.Error, (e) => console.error(`[Discord API]: ${e}`));
bot.on(Events.Warn, (e) => console.warn(`[Discord API]: ${e}`));
bot.on(Events.Invalidated, () => {
    console.log('[Info]: Session invalidated! Goodbye!');
    bot.destroy();
    process.exit(1);
});

// Login **********************************************************************

bot.login(process.env.DISCORD_TOKEN);