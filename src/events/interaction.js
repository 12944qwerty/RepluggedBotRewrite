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
        //console.log(interaction);
        slashCommands.forEach(async command => {
            console.log(command);
        });
    }
}