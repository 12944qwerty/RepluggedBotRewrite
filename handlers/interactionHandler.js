import colors from 'lighter-colors';
import { debug } from "../lib/flags.js";

export async function handleInteraction(interaction, cli, slashCommands) {

    // Button Handler
    if (interaction.isButton()) {
        if (debug) {
            console.log(`[Interaction Handler]: Button interaction received: ${interaction.customId}`.magenta);
        }

    }

    // Command Handler
    if (interaction.isCommand()) {
        try {
            slashCommands.get(interaction.commandName).execute(interaction, cli);
            if (debug) {
                console.log(`[Slash Command Handler]: Executed slash command ${interaction.commandName}`.green);
            }
        } catch (err) {
            console.log(colors.red(err));
        }
    }
}