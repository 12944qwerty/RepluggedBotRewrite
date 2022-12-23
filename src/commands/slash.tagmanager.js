import { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { delKey, addKey } from '../db/mongo.js';
export const data = new SlashCommandBuilder()
    .setName('tagmanager')
    .setDescription('Manage tags.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a tag.')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The name of the tag.')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('content')
                    .setDescription('The content of the tag.')
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a tag.')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The name of the tag.')
                    .setRequired(true)));

export async function execute(interaction) {
    if (interaction.options.getSubcommand() === 'create') {
        const name = interaction.options.getString('name');
        const content = interaction.options.getString('content');
        await addKey('tags', name, content);
        const embed = new EmbedBuilder()
            .setTitle('Reaction Manager')
            .setDescription(`Reaction \`${name}\` created.`)
            .setColor(0x00ff00);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (interaction.options.getSubcommand() === 'delete') {
        const name = interaction.options.getString('name');
        await delKey('tags', name);
        const embed = new EmbedBuilder()
            .setTitle('Tag Manager')
            .setDescription(`Tag \`${name}\` deleted.`)
            .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}