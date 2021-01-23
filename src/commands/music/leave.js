var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

module.exports = {
    config: {
        permissions: [],
        description: `make me leave the voice channel you're in`,
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
            context.music.instances.get(context.guild.id).connection.disconnect();
            context.music.instances.delete(context.guild.id);
            embed.setDescription(`left the channel`);
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}