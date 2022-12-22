import { readdirSync } from 'fs';
export let slashCommandData = [];
export let slashCommands = new Map();

export async function indexSlashCommands() {
    const commandFiles = readdirSync('./src/commands/').filter(file => file.endsWith('.js') && file.startsWith('slash.'));
    for (const file of commandFiles) {
        const command = await import(`../commands/${file}`);
        slashCommandData.push(command.data);
        slashCommands.set(command.data.name, command);
    }
}
