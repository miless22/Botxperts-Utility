const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1296855826585358377'; // Channel ID for logging

        // Handle dropdown selection for support tickets and bot purchases
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'supportOptions') {
                const selectedValue = interaction.values[0];

                if (selectedValue === 'st') {
                    const modal = new ModalBuilder()
                        .setCustomId('ticketReasonModal')
                        .setTitle('Ticket Reason');

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for the ticket')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const row = new ActionRowBuilder().addComponents(reasonInput);
                    modal.addComponents(row);

                    await interaction.showModal(modal);
                    return;
                }

                if (selectedValue === 'bp') {
                    await interaction.deferReply({ ephemeral: true });

                    const reason = "Bot Purchase Request";

                    const purchaseChannel = await interaction.guild.channels.create({
                        name: `purchase-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: '1296840997720035454', // Bot Purchase role
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });

                    const purchaseEmbed = new EmbedBuilder()
                        .setColor('#2F3136')
                        .setTitle('Premium Purchase')
                        .setDescription(`Hello <@${interaction.user.id}>, your bot purchase ticket has been opened. Please wait for staff to assist you.\nReason: ${reason}`)
                        .setFooter({ text: `Ticket opened by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                    const purchaseCloseButton = new ButtonBuilder()
                        .setCustomId('closePurchaseTicket')
                        .setLabel('Close Purchase Ticket')
                        .setStyle(ButtonStyle.Danger);

                    await purchaseChannel.send({ content: `<@${interaction.user.id}>, <@&1296840997720035454>`, embeds: [purchaseEmbed], components: [new ActionRowBuilder().addComponents(purchaseCloseButton)] });

                    // Log the ticket opening
                    const logChannel = interaction.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor('#2F3136')
                            .setTitle('Ticket Opened')
                            .setDescription(`A new bot purchase ticket has been opened by <@${interaction.user.id}> in <#${purchaseChannel.id}>.\nReason: ${reason}`)
                            .setTimestamp();

                        await logChannel.send({ embeds: [logEmbed] });
                    }

                    await interaction.editReply({ content: 'Your bot purchase ticket has been opened!', ephemeral: true });
                    return;
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticketReasonModal') {
                const reason = interaction.fields.getTextInputValue('reasonInput');
                await interaction.deferReply();

                const supportChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1296907929743790120', // Support team role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const embed = new EmbedBuilder()
                    .setColor('#2F3136')
                    .setTitle('Ticket Opened')
                    .setDescription(`Hello <@${interaction.user.id}>, your support ticket has been opened. Please wait for staff to respond.\nReason: ${reason}`)
                    .setFooter({ text: `Ticket opened by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                const closeButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger);

                await supportChannel.send({ content: `<@${interaction.user.id}>, <@&1296907929743790120>`, embeds: [embed], components: [new ActionRowBuilder().addComponents(closeButton)] });

                await interaction.editReply({ content: 'Your ticket has been opened.', ephemeral: true });

                // Log the ticket opening
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#2F3136')
                        .setTitle('Ticket Opened')
                        .setDescription(`A new support ticket has been opened by <@${interaction.user.id}> in <#${supportChannel.id}>.\nReason: ${reason}`)
                        .setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }

                const targetChannel = interaction.guild.channels.cache.get('1296863854348865536');
                if (targetChannel) {
                    setTimeout(async () => {
                        const messages = await targetChannel.messages.fetch({ limit: 1 });
                        if (messages.size > 0) {
                            const lastMessage = messages.first();
                            await lastMessage.delete();
                        }
                    }, 3000);
                }
                return;
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'closeTicket' || interaction.customId === 'closePurchaseTicket') {
                const confirmationEmbed = new EmbedBuilder()
                    .setColor('#2F3136')
                    .setTitle('Close Ticket')
                    .setDescription('Are you sure you want to close this ticket? This action cannot be undone.');

                const finalCloseButton = new ButtonBuilder()
                    .setCustomId('confirmClose')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Secondary);

                await interaction.reply({ embeds: [confirmationEmbed], components: [new ActionRowBuilder().addComponents(finalCloseButton)], ephemeral: true });
                return;
            }

            if (interaction.customId === 'confirmClose') {
                await new Promise((resolve) => setTimeout(resolve, 3000));

                const ticketChannel = interaction.channel;
                const messages = await ticketChannel.messages.fetch({ limit: 100 });
                const transcript = [];

                messages.forEach(msg => {
                    if (!msg.author.bot) {
                        transcript.push({
                            username: msg.author.username,
                            content: msg.content,
                            timestamp: msg.createdAt,
                            avatar: msg.author.displayAvatarURL(),
                        });
                    }
                });

                const messagesHTML = transcript.map(msg => `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #f3f3f3;">${msg.username}</strong>
                        <span style="color: #B9BBBE;">(${new Date(msg.timestamp).toLocaleString()})</span>
                        <div style="background: #f1f1f1; padding: 5px; border-radius: 5px;">
                            ${msg.content}
                        </div>
                        <img src="${msg.avatar}" alt="${msg.username}'s Avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-top: 5px;">
                    </div>
                `).join('');

                const transcriptHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Ticket Transcript for ${interaction.user.username}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #2F3136;
                                color: black;
                                padding: 20px;
                            }
                            h1 {
                                color: #f3f3f3;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Ticket Transcript for ${interaction.user.username}</h1>
                        <div>${messagesHTML}</div>
                    </body>
                    </html>
                `;

                const transcriptFilePath = path.join(__dirname, `${interaction.channel.name}-transcript.html`);
                fs.writeFileSync(transcriptFilePath, transcriptHTML);

                const ticketOwner = interaction.user;

                const closeEmbed = new EmbedBuilder()
                    .setColor('#2F3136')
                    .setTitle('Ticket Closed')
                    .setDescription(`Ticket has been closed.\n\n**Opened by:** ${ticketOwner.tag}\n**Opened at:** ${interaction.channel.createdAt}\n**Closed at:** ${new Date()}`)
                    .setFooter({ text: `Ticket closed by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                await ticketOwner.send({
                    content: 'Here is the transcript for your ticket:',
                    files: [{ attachment: transcriptFilePath, name: 'transcript.html' }],
                    embeds: [closeEmbed],
                }).catch(err => console.error('Could not send DM to user:', err));

                // Log the ticket closing
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#2F3136')
                        .setTitle('Ticket Closed')
                        .setDescription(`Ticket closed by <@${interaction.user.id}> in <#${ticketChannel.id}>.\n**Opened by:** ${ticketOwner.tag}\n**Opened at:** ${interaction.channel.createdAt}\n**Closed at:** ${new Date()}`)
                        .setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await ticketChannel.delete();
            }
        }
    },
};
