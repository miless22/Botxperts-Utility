const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinformation')
        .setDefaultMemberPermissions(0)  // Makes the command admin-only
        .setDescription('Displays the server rules and information'),
    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });
        
        const targetChannelId = '1292564896449560672';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        // Define each embed with detailed rules
        const embeds = [
            new EmbedBuilder()
                .setTitle('<:Rules:1297076965462904895> Server Regulations <:Rules:1297076965462904895> ')
                .setColor('#2F3136')
                .setDescription('Listed below are all the regulations of the server. If you have any questions or concerns, please contact the staff team.'),

            new EmbedBuilder()
                .setTitle('Rule 1: Respect Everyone')
                .setColor('#2F3136')
                .setDescription('Respect is the foundation of our community. Harassment, hate speech, or bullying will not be tolerated.'),

            new EmbedBuilder()
                .setTitle('Rule 2: Age Requirement')
                .setColor('#2F3136')
                .setDescription('Members must be at least 13 years old to participate in the server. Members under this age will be banned.'),

            new EmbedBuilder()
                .setTitle('Rule 3: No Spamming')
                .setColor('#2F3136')
                .setDescription('Members are expected to refrain from sending repetitive messages that do not contribute to the discussion.'),

            new EmbedBuilder()
                .setTitle('Rule 4: No Advertising')
                .setColor('#2F3136')
                .setDescription('All forms of advertising without permission from staff are prohibited.'),

            new EmbedBuilder()
                .setTitle('Rule 5: Privacy Matters')
                .setColor('#2F3136')
                .setDescription('Respect the privacy of all members. Do not share personal information without consent.')
        ];

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('server_information')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Server Website',
                    description: 'The official BotXperts website',
                    value: 'sw',
                },
                {
                    label: 'Server Invite Link',
                    description: 'The official Discord server invite',
                    value: 'sil',
                },
                {
                    label: 'Bot Information',
                    description: 'Information about the server bots.',
                    value: 'bi',
                },
                {
                    label: 'How to get hired',
                    description: 'Steps to apply for a position at BotXperts.',
                    value: 'htgh',
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send all embeds and the select menu to the target channel
        await targetChannel.send({ embeds, components: [row] });

        // Acknowledge the command
        await interaction.editReply({ content: 'Server rules have been sent to the channel.', ephemeral: true });
    },
};
