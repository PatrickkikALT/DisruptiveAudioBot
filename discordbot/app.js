'use strict';
const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready, logged in as ${readyClient.user.tag}`);
});
client.commands = new Collection();

const folders = path.join(__dirname, 'Commands');
const commandsFolders = fs.readdirSync(folders);
for (const folder of commandsFolders) {
	const cmdPath = path.join(folders, folder);
	const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(path.join(cmdPath, file));
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command)
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		return;
	}
	try {
		await command.execute(interaction);
	} 
	catch (error) {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error.', flags: MessageFlags.Ephemeral});
		}
		else {
			await interaction.reply({ content: 'There was en error.', flags: MessageFlags.Ephemeral});
		}
	}
}
)
client.login(token);