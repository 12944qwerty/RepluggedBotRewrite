import { slashCommands } from '../indexer/slash.js';

export async function handleInteraction(interaction, bot) {
    if (interaction.isCommand()) {
        try {
            slashCommands.get(interaction.commandName).execute(interaction, bot);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    else if (interaction.isButton()) {
        for (const command of slashCommands) {
            const buttons = command[1]?.buttons; // first item in array is the command name, second is the command object
            if (!buttons) continue;
            buttons.forEach(async button => {
                if (button.id === interaction.customId) {
                    await button.execute(interaction, bot);
                }
            });

        }
    }
}