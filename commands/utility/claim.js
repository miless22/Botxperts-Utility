const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim a ticket for handling.')
        .setDefaultMemberPermissions(0), // No default permissions, handled below
    async execute(interaction) {
        // Check if the user has one of the specified roles
        const memberRoles = interaction.member.roles.cache.map(role => role.id);
        const allowedRoles = ['1296840997720035454', '1296907929743790120'];

        if (!allowedRoles.some(role => memberRoles.includes(role))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Logic for claiming the ticket
        const ticketChannel = interaction.channel;

        if (!ticketChannel.name.startsWith('ticket-') && !ticketChannel.name.startsWith('purchase-')) {
            return interaction.reply({ content: 'This command can only be used in a ticket channel.', ephemeral: true });
        }

        // Here you would implement the claiming logic, such as changing the channel name, adding a message, etc.
        await ticketChannel.setName(`${ticketChannel.name}-claimed`);

        // Create the embed message
        const claimEmbed = new EmbedBuilder()
            .setColor('#2F3136') // You can change this color
            .setTitle('Ticket Claimed')
            .setDescription(`The ticket **${ticketChannel.name}** has been successfully claimed by <@${interaction.user.id}>.`)
            .setFooter({ text: `Claimed by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        // Send the embed to the channel
        await interaction.reply({ embeds: [claimEmbed], ephemeral: false });
    },
};
