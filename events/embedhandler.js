const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isModalSubmit() && interaction.customId === 'embedModal') {
            const title = interaction.fields.getTextInputValue('embedTitle');
            const description = interaction.fields.getTextInputValue('embedDescription');

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor('#2F3136')
                .setTitle(title)
                .setDescription(description)
                .setFooter({
                    text: 'BotXperts',
                    iconURL: 'https://cdn.discordapp.com/attachments/1295179980325650544/1296843258592231507/BLACK_1.png?ex=6713c2e7&is=67127167&hm=0d58a1fcf81c583a64fadef37fda75e05369012db65940e0ddcf8cdb2ec590f7&',
                });

            // Send the embed to the channel where the command was used
            await interaction.channel.send({ embeds: [embed] });

            // Reply to the interaction
            await interaction.reply({ content: 'Embed sent successfully!', ephemeral: true });
        }
    },
};
