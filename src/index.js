import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';

config();

export const bot = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

// Ready Event

bot.once(Events.ClientReady, () => {
    console.log(`[Info]: Connected To Discord!\n[Info]:\tGuild Count: ${bot.guilds.cache.size}\n[Info]:\tMy ID: ${bot.user?.id}`);
});

// DB Connection ***************************************************************

import { connectDB } from './db/mongo.js';
await connectDB();

// Slash Command Indexer ******************************************************

import { indexSlashCommands } from './indexer/slash.js';
await indexSlashCommands();

// Push Slash Commands To Discord *********************************************

import { pushCommands } from './lib/pushCommands.js';
await pushCommands();

// Interaction Handler ********************************************************

import { handleInteraction } from './handler/interaction.js';

bot.on(Events.InteractionCreate, async interaction => {
    try {
        await handleInteraction(interaction, bot);
    } catch
    (error) {
        console.error(`[Interaction Handler]: ${error}`);
    }
});


// Message Handler ***********************************************************

import { handleMessage } from './handler/message.js';

bot.on(Events.MessageCreate, async message => {
    try {
        await handleMessage(message, bot);
    } catch
    (error) {
        console.error(`[Message Handler]: ${error}`);
    }
});


// Guild Member Left *********************************************************

import { handleMemberLeave } from './handler/memberLeave.js';

bot.on(Events.GuildMemberRemove, async member => {
    try {
        await handleMemberLeave(member);
    } catch (error) {
        console.error(`[Guild Leave Handler]: ${error}`);
    }
});

// Guild Member Update ********************************************************

import { handleMemberUpdate } from './handler/memberUpdate.js';

bot.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    try {
        await handleMemberUpdate(oldMember, newMember);
    } catch (error) {
        console.error(`[Guild Update Handler]: ${error}`);
    }
});




// Other Events ***************************************************************

bot.on(Events.Error, (e) => console.error(`[Discord API]: ${e}`));
bot.on(Events.Warn, (e) => console.warn(`[Discord API]: ${e}`));
bot.on(Events.Invalidated, async () => {
    console.log('[Fatal]: Session invalidated! Goodbye!');
    await bot.db.close();
    bot.destroy();
    process.exit(1);
});

// Login **********************************************************************

bot.login(process.env.DISCORD_TOKEN);