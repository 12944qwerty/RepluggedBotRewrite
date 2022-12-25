import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { blacklistAndDeleteUser, userExists } from '../db/mongo.js';
export const data = new SlashCommandBuilder()
    .setName('optout')
    .setDescription('Opt out of the Replugged database');

export async function execute(interaction) {
    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('optout.optout')
                .setLabel('Delete my data')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⚠️'),
            new ButtonBuilder()
                .setCustomId('optout.cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('❌'),
            new ButtonBuilder()
                .setLabel('Privacy Policy')
                .setStyle(ButtonStyle.Link)
                .setURL('https://replugged.dev/legal/privacy')
                .setEmoji('📜'),

        );
    const embed = new EmbedBuilder()
        .setTitle('⚠️ **Opting out of the Replugged database** ⚠️')
        .setDescription('You are attempting to delete your information from the Replugged database and blacklist yourself from being added again automatically.\n\n**THIS WILL BREAK ANY REPLUGGED INTEGRATIONS**\n\nOpting out of the Replugged database will remove any badges you have and Spotify integration!\n\n⚠️ ***This will also remove any plugins or themes you made from the Replugged store!!!***\n\nAre you sure you want to do this?\n\n*ℹ️ Your user ID will still be stored to put you in the blacklist.*')
        .setColor(0xff0000);
    await interaction.reply({ embeds: [embed], ephemeral: true, components: [buttons] });

}

export const buttons = [
    {
        'id': 'optout.optout',
        'execute': async function (interaction) {
            if (!(await userExists(interaction.user.id))) {
                await interaction.reply({ content: 'You do not exist in the replugged database.', ephemeral: true });
                return;
            }
            await blacklistAndDeleteUser(interaction.member);
            await interaction.reply({ content: 'You have been opted out of the Replugged database.', ephemeral: true });
        }
    },
    {
        'id': 'optout.cancel',
        'execute': async function (interaction) {
            await interaction.reply({ content: 'Opting out cancelled.', ephemeral: true });
        }
    }
];