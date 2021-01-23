var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

module.exports = {
    config: {
        permissions: [],
        description: `make me join the voice channel you're in`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: []
    },

    /**
     * 
     * @param {CommandContext} context 
     */
    command: async function(context) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        if (context.member.voice.channelID) {
            if (context.member.voice.channel.joinable) {
                context.music.instances.set(context.guild.id, {
                    connection: await context.member.voice.channel.join(),
                    queue: [],
                    playing: false,
                    volume: 100
                });

                context.music.instances.get(context.guild.id).connection.on('error', function(error) {
                    console.error(error);
                    context.music.instances.get(context.guild.id).connection.disconnect();
                    context.music.instances.delete(context.guild.id);
                });

                embed.setDescription(`connected to \`${context.member.voice.channel.name}\``);
            }

            else { embed.setDescription(`I don't have permission to join that voice channel`) }
        }


        else { embed.setDescription(`you're not in a voice channel`) }

        context.channel.send(embed);
    }
}