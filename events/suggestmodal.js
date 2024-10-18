const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'suggestionModal') {
      const suggestion = interaction.fields.getTextInputValue('suggestionInput');

      // Create the embed for the suggestion
      const embed = new EmbedBuilder()
        .setColor(`#2F3136`)
        .setTitle('New Suggestion')
        .addFields(
          { name: 'Suggestion', value: suggestion, inline: false },
          { name: 'Submitted by', value: interaction.user.tag, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true })) // Set the user's avatar as the thumbnail
        .setFooter({
          text: 'BotXperts',
          iconURL: 'https://cdn.discordapp.com/attachments/1295179980325650544/1296843258592231507/BLACK_1.png?ex=6713c2e7&is=67127167&hm=0d58a1fcf81c583a64fadef37fda75e05369012db65940e0ddcf8cdb2ec590f7&', // Set the specific image URL as the footer icon
        });

      // Send the suggestion to the specified channel
      const suggestionChannel = interaction.guild.channels.cache.get('1296867363882405990'); // Replace with your channel ID
      if (suggestionChannel) {
        try {
          const suggestionMessage = await suggestionChannel.send({ embeds: [embed] });

          // React to the message with 👍 and 👎
          await suggestionMessage.react('👍');
          await suggestionMessage.react('👎');

          // Reply to the user who made the suggestion
          await interaction.reply({ content: 'Thank you for your suggestion!', ephemeral: true });
        } catch (error) {
          console.error('Error sending suggestion or adding reactions:', error);
          await interaction.reply({ content: 'There was an error processing your suggestion.', ephemeral: true });
        }
      } else {
        await interaction.reply({ content: 'Unable to find the suggestion channel.', ephemeral: true });
      }
    }
  },
};
