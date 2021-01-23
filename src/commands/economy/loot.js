var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'loot the chat!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        cooldown: 300000,
        params: []
    },

    command: async function(context, parameters) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        var money = Math.floor(Math.random() * 500) + 150;
        var multiplyOdds = Math.floor(Math.random() * 4);
        if (multiplyOdds == 0) { money = Math.floor(money * 1.5) }
        var nilOdds = Math.floor(Math.random() * 8);
        if (nilOdds == 0) { money = 0 }
        if (money == 0) { embed.setDescription(`you sifted through the chat and sadly found nothing ;-;`) }
        else {
            context.inventory.addMoney(context, context.user.id, money);
            embed.setDescription(`while sifting through the chat you found **$${money}**`);
        }


        context.channel.send(embed);
    }
}