var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

module.exports = {
    config: {
        permissions: [],
        description: `get the queue of selected songs`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: [
            { type: 'number', required: false, name: 'page' }
        ]
    },

    /**
     * 
     * @param {CommandContext} context 
     * @param {any[]} parameters 
     */
    command: async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let result = context.music.check(context);
        if (result == -1) {
            let queue = context.music.instances.get(context.guild.id).queue;

            if (queue.length > 0) {

                let maxPage = Math.ceil(queue.length / 10) - 1;
                let page = parameters[0] ? parameters[0] - 1 : 0;
                if (page < 0) { page = 0 }

                let arr = [];
                if (page <= maxPage) {
                    for (let i = 0; i < 10; i++) {
                        if (queue[(page * 10) + i]) {
                            let title = Discord.Util.escapeMarkdown(queue[(page * 10) + i].title);
                            if (page == 0 && i == 0) { arr.push(`**${(page * 10) + i + 1}: ${title}**`) }
                            else { arr.push(`${(page * 10) + i + 1}: ${title}`) }
                        }
                    }

                    embed.setDescription(arr.join('\n'));
                    embed.setFooter(`page ${page + 1}/${maxPage + 1}`);
                }

                else { embed.setDescription(`please specify a smaller page number`) }
            }

            else { embed.setDescription(`there's currently no music in the queue`) }
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}