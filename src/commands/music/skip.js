var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: `skips the song that's currently playing`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: []
    },
    
    command: async function(context) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let result = context.music.check(context);
        if (result == -1) {
            if (context.music.instances.get(context.guild.id).playing) {
                let title = context.music.instances.get(context.guild.id).queue[0].title;
                context.music.instances.get(context.guild.id).connection.dispatcher.end();
                embed.setDescription(`skipped **${Discord.Util.escapeMarkdown(title)}**`);
            }

            else { embed.setDescription(`noting is currently playing`) }
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}