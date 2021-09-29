const {joinVoiceChannel} = require('@discordjs/voice');

module.exports = {
    createData: {
        name: "ping", 
        description: "Replies with pong",
    },
    fn: async function execute(interaction) {
        console.log(interaction.member.voice.channel);
        let channel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        })
        await interaction.reply('Pong!');
    },
};