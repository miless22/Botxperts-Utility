const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;

    // Handle feedback modal submission
    if (interaction.customId === 'feedbackModal') {
      const feedback = interaction.fields.getTextInputValue('feedbackInput');
      const rating = interaction.fields.getTextInputValue('ratingInput');

      // Ensure rating is a valid number between 1 and 5
      const ratingNumber = parseInt(rating);
      
      // Create the embed for the feedback
      const embed = new EmbedBuilder()
        .setColor(`#2F3136`)
        .setTitle('Feedback')
        .addFields(
          { name: 'Feedback', value: feedback, inline: false },
          { name: 'Rating', value: ratingNumber >= 1 && ratingNumber <= 5 ? `${ratingNumber}/5` : 'Invalid rating', inline: false },
          { name: 'Submitted by', value: interaction.user.tag, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: 'BotXperts',
          iconURL: 'https://cdn.discordapp.com/attachments/1295179980325650544/1296843258592231507/BLACK_1.png?ex=6713c2e7&is=67127167&hm=0d58a1fcf81c583a64fadef37fda75e05369012db65940e0ddcf8cdb2ec590f7&',
        });

      // Send the feedback to the specified channel
      const feedbackChannel = interaction.guild.channels.cache.get('1296867350804697098'); // Your channel ID
      if (feedbackChannel) {
        try {
          const feedbackMessage = await feedbackChannel.send({ embeds: [embed] });

          // Reply to the user who made the feedback submission
          await interaction.reply({ content: 'Thank you for your feedback!', ephemeral: true });
        } catch (error) {
          console.error('Error sending feedback:', error);
          await interaction.reply({ content: 'There was an error processing your feedback.', ephemeral: true });
        }
      } else {
        await interaction.reply({ content: 'Unable to find the feedback channel.', ephemeral: true });
      }
    }
  },
};
