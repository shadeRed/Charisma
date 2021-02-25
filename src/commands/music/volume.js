var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: `sets the volume of the music stream`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: [ { type: 'number', required: true, name: '0-200' } ]
    },

    command: async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let result = context.music.check(context);
        if (result == -1) {
            if (0 <= parameters[0] && parameters[0] <= 200) {
                context.music.instances.get(context.guild.id).volume = parameters[0];
                context.music.instances.get(context.guild.id).connection.dispatcher.setVolume(parameters[0]/100);
                embed.setDescription(`the volume has been set to \`${parameters[0]}\``);
            }

            else { embed.setDescription(`the volume has to be 0-100`) }
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}