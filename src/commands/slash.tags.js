import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('tags')
    .setDescription('View tags.');

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('List of tags')
        .setDescription('This command is not yet implemented.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
}