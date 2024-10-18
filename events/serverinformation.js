const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'server_information') {
            const selectedValue = values[0];
            let embed;

            // Different ephemeral "Hi" messages for each option
            if (selectedValue === 'sw') {
                embed = new EmbedBuilder()
                .setTitle(`Server Website`)
                    .setDescription(`**coming soon**`)
                    .setColor(`#2F3136`);
            } else if (selectedValue === 'sil') {
                embed = new EmbedBuilder()
                .setColor(`#2F3136`)
                .setTitle(`Server Invite Link`)
                    .setDescription(`https://discord.gg/FWHs3AyCvT`)
                    .setColor(`#2F3136`);
            } else if (selectedValue === 'htgh') {
                embed = new EmbedBuilder()
                .setTitle(`How to Apply for a Position at BotXperts`)
                    .setDescription(`

To express your interest in joining BotXperts, please follow these steps:

1. **Open a Ticket**: Begin by opening a ticket in the designated channel <#1296863671133143163>.
   
2. **Notify Us of Your Intent**: Once the ticket is open, kindly inform us of your desire to be hired by providing the relevant details.

**Please Note**: It is essential that candidates possess a solid understanding of Discord customizations, including the creation of bots and templates.

Thank you for your interest in becoming a part of BotXperts!

`)
                    .setColor(`#2F3136`);
            } else if (selectedValue === 'notused') {
                embed = new EmbedBuilder()
                    .setDescription(`notusedlil bro`)
                    .setColor('#aed191');
            }

            // Send the selected embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
