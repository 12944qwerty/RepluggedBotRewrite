import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('optout')
    .setDescription('Opt out of the Replugged database');

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('⚠️ **Opting out of the Replugged database** ⚠️')
        .setDescription('You are attempting to delete your information from the Replugged database and blacklist yourself from being added again automatically.\n\n**THIS WILL BREAK ANY REPLUGGED INTEGRATIONS**\n\nOpting out of the Replugged database will remove any badges you have and Spotify integration!\n\n⚠️ ***This will also remove any plugins or themes you made from the Replugged store!!!***\n\nAre you sure you want to do this?\n\n*ℹ️ Your user ID will still be stored to put you in the blacklist.*\n\n\nQuestions? https://replugged.dev/legal/privacy')
        .setColor(0xff0000);
    await interaction.reply({ embeds: [embed], ephemeral: true });
}