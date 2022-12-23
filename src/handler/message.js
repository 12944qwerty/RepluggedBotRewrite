import { getKeys } from '../db/mongo.js';

export async function handleMessage(message) {
    console.log(message.content);
    if (message.author.bot) return;
    if (!message.content) return;

    const keys = await getKeys('tags');
    const organizedResponses = keys.map(key => key[Object.keys(key)[0]]);
    const organizedTriggers = keys.map(key => Object.keys(key)[0]);

    for (const trigger in organizedTriggers) {
        if (message.content.toLowerCase().includes(organizedTriggers[trigger])) {
            message.reply(organizedResponses[trigger]);
        }
    }

}