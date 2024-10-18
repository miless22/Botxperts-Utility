const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsupport')
    .setDescription('Open a ticket support dropdown.'),
  async execute(interaction) {
    // Check if the user has admin permissions
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Create the embed message
    const embed = new EmbedBuilder()
      .setColor(`#2F3136`)
      .setTitle('Server Support')
      .setDescription('> Please select the appropriate option for the ticket you wish to open. Opening a ticket for the wrong reason or for trolling purposes will lead to necessary consequences. We appreciate your patience, as our staff may be attending to multiple inquiries at once.');

    // Create the dropdown menu
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('supportOptions')
          .setPlaceholder('Select an option')
          .addOptions([
            {
              label: 'Support Ticket',
              description: `Open a support ticket`,
              value: 'st',
            },
            {
              label: 'Premium Purchase',
              description: 'Purchase the premium subscription',
              value: 'bp',
            },
          ])
      );

    // Send the embed with the dropdown to the specified channel
    const supportChannel = interaction.guild.channels.cache.get('1296863854348865536');
    if (supportChannel) {
      await supportChannel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: 'The support ticket options have been sent.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Unable to find the support channel.', ephemeral: true });
    }
  },
};
