import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('reactions')
    .setDescription('View reactions.');

export async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('List of reaction triggers')
        .setDescription('This command is not yet implemented.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
}