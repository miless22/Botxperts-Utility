require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commandArray = [];

// Ready event to log bot information
client.once('ready', () => {
  // console.log(`${client.user?.username} - (${client.user?.id})`); // Log bot username and ID when ready
});

const handleEvents = async () => {
  const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
};

const handleCommands = async () => {
  const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const clientId = "1296841731580362796"; 
  const guildId = "1292564896449560670"; 
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: client.commandArray,
    });
    console.log("Slash commands uploaded");
  } catch (error) {
    console.error(error);
  }
};

client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

(async () => {
  await client.handleEvents();
  await client.handleCommands();
})();

client.login(token);
