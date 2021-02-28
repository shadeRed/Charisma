var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'gets your balance',
        hidden: false,
        nsfw: false,
        aliases: ['bal'],
        tags: ['economy'],
        params: []
    },

    command: async function(context) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);

        let inventory = new context.inventory(context.user.id);
        await inventory.init();
        let balance = inventory.money.get();

        embed.setDescription(`${balance}g`);
        context.channel.send(embed);
    }
}