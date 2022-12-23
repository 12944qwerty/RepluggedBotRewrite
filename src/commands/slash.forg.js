import { SlashCommandBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('forg')
    .setDescription('forg.');


export async function execute(interaction) {
    await interaction.reply(':forg1::forg2::forg3::forg4::forg5:');
}