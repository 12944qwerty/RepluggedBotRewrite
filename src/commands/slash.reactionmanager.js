import { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { delKey, addKey } from '../db/mongo.js';
export const data = new SlashCommandBuilder()
    .setName('reactionmanager')
    .setDescription('Manage reactions.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a reaction.')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The name of the reaction.')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('content')
                    .setDescription('The emoji to react with.')
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a reaction.')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The name of the reaction.')
                    .setRequired(true)));

export async function execute(interaction) {
    if (interaction.options.getSubcommand() === 'create') {
        const name = interaction.options.getString('name');
        const content = interaction.options.getString('content');
        await addKey('reactions', name, content);
        const embed = new EmbedBuilder()
            .setTitle('Reaction Manager')
            .setDescription(`Reaction \`${name}\` created.`)
            .setColor(0x00ff00);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (interaction.options.getSubcommand() === 'delete') {
        const name = interaction.options.getString('name');
        await delKey('reactions', name);
        const embed = new EmbedBuilder()
            .setTitle('Reaction Manager')
            .setDescription(`Reaction \`${name}\` deleted.`)
            .setColor(0xff0000);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

}
