import { slashCommands } from '../indexer/slash.js';

export async function handleInteraction(interaction, cli) {
    if (interaction.isCommand()) {
        try {
            slashCommands.get(interaction.commandName).execute(interaction, cli);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
