const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder } = require ('discord.js');
const player = createAudioPlayer();
const path = __dirname + "\\Voice\\audio.ogg";
module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription("joins your channel"),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const voiceChannel = member.voice.channel;
        if (voiceChannel) {
            interaction.reply("Joined your voice channel");
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            })
            const subscription = connection.subscribe(player)
            connection.receiver.speaking.on('start', (userId) => {
                player.play(createAudioResource(path));
            })
            connection.receiver.speaking.on('end', (userId) => {
                player.stop();
            })
        }
        else {
            interaction.reply("You're not in a voice channel.")
        }
    }
}
