const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Submit a suggestion.'),
  async execute(interaction) {
    // Create a modal
    const modal = new ModalBuilder()
      .setCustomId('suggestionModal')
      .setTitle('Submit Your Suggestion');

    const suggestionInput = new TextInputBuilder()
      .setCustomId('suggestionInput')
      .setLabel('What would you like to suggest?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Type your suggestion here...')
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(suggestionInput);
    modal.addComponents(row);

    // Show the modal
    await interaction.showModal(modal);
  },
};
