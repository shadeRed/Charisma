var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'unequip a certain item',
        hidden: false,
        nsfw: false,
        tags: ['fun', 'inventory'],
        params: [
            { type: 'item', required: true },
        ]
    },

    command: async function(context, parameters) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);

        let items = context.economy.items;

        if (!items[parameters[0]].tags.includes('key')) { embed.setDescription(`${items[parameters[0]].emoji} isn't an equippable item`); return context.channel.send(embed) }

        let inventory = new context.inventory(context.user.id);
        await inventory.init();
        if (inventory.keys.has(parameters[0])) {
            inventory.keys.remove(parameters[0]);
            await inventory.append();
            embed.setDescription(`you unequipped ${items[parameters[0]].emoji}`);
        }

        else { embed.setDescription(`you don't have a ${items[parameters[0]].emoji} equipped`) }

        context.channel.send(embed);        
    }
}