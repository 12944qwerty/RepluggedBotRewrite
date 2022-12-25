import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUser, isBlacklisted } from '../db/mongo.js';
export const data = new SlashCommandBuilder()
    .setName('viewdata')
    .setDescription('View your entry in the Replugged database');

export async function execute(interaction) {

    let user;
    try {
        user = await getUser(interaction.user.id);
    } catch (e) {
        console.error(e);
        if (e.message == 'nonexistent') {
            await interaction.reply({ content: 'You do not exist in the replugged database.', ephemeral: true });
            return;
        } else {
            await interaction.reply({ content: 'An error occurred while fetching your data.', ephemeral: true });
            console.log(`[slash.viewdata] Error while fetching user data: ${e}`);
            return;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('Your data in the Replugged database')
        .addFields(
            { name: 'User ID', value: user._id },
            { name: 'Blacklisted', value: await isBlacklisted(interaction.user.id) ? 'True' : 'False' }
        );




    if (await isBlacklisted(interaction.user.id)) {
        embed
            .setDescription('You opted out of being in the replugged database. This is the only data associated with your account.');
    } else {
        embed
            .setDescription('This is your data in the Replugged database. If you want to opt out of the database, use `/optout`.\n\n*Data for account authentication will not be shown here.*\n\n*Data returned here is generally not anything sensitive, but it is still recommended you keep this to yourself.*')
            .addFields(
                { name: 'Tag', value: `${user.username}#${user.discriminator}` },
                { name: 'Avatar', value: user.avatar },
                { name: 'Flags', value: `\`\`\`json\n${JSON.stringify(user.flags, null, 4)}\`\`\`` },
                { name: 'CutieStatus Object', value: `\`\`\`json\n${JSON.stringify(user.cutieStatus, null, 4)}\`\`\`` },
                { name: 'CutiePerks Object', value: `\`\`\`json\n${JSON.stringify(user.cutiePerks, null, 4)}\`\`\`` },
                { name: 'Accounts', value: `\`\`\`yaml\n- ${Object.keys(user.accounts).join('\n- ')}\`\`\`` },
            );

    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
}