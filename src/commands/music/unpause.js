var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

module.exports = {
    config: {
        permissions: [],
        description: `pause the music player`,
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
        
        let result = context.music.check(context);
        if (result == -1) {
            if (context.music.instances.get(context.guild.id).connection.dispatcher.paused) {
                context.music.resume(context.guild.id);
                embed.setDescription(`unpaused the music player`);
            }

            else { embed.setDescription(`the player isn't paused`) }
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}