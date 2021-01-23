var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = {
    config: {
        permissions: [],
        description: `shuffles the music queue`,
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
            shuffle(context.music.instances.get(context.guild.id).queue);
            context.music.instances.get(context.guild.id).connection.dispatcher.end('noShift');
            embed.setDescription(`shuffled the queue`);
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}