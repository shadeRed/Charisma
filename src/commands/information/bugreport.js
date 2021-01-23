var Discord = require('discord.js');
let CommandContext = require('./../../classes/CommandContext.js');

module.exports = {
    config: {
        permissions: [],
        description: 'report a bug!',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: 'string', required: true, name: 'description' }
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
        embed.setDescription(`bug has been reported and will be sent off for review!`);

        let red = await context.client.users.fetch('277731072496631809');
        red.send(`bug reported:\n${parameters[0]}`);

        context.channel.send(embed);
    }
}