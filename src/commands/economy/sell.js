var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'sell something',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            [
                { type: 'item', required: true },
                { type: 'number', required: false, name: 'quantity' }
            ],

            [
                { type: 'string', required: true, name: 'item' },
                { type: 'itemQuery', required: true, name: 'query' }
            ]
        ]
    },

    command: [
        async function(context, parameters) {
            var embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
        
            let quantity = 1;
            if (parameters[1]) { quantity = parameters[1] }
        
            let inventory = new context.inventory(context.user.id);
            await inventory.init();

            let item = inventory.items.get(parameters[0]);
            if (item) {
                if (item.length < quantity) { embed.setDescription(`you don't have ${context.economy.items[parameters[0]].emoji}x${quantity}`) }
                else {
                    let value = context.shop.getValue(parameters[0]);
                    let total = value * quantity;

                    for (let q = 0; q < quantity; q++) { inventory.items.remove(parameters[0], 0) }
                    let individuals = quantity == 1 ? '' : `*($${Math.floor(total / quantity)} each)*`;

                    inventory.money.add(total);
                    await inventory.append();

                    embed.setDescription(`you sold ${context.economy.items[parameters[0]].emoji}x${quantity} and got **$${total}** ${individuals}`);
                }
            }

            else { embed.setDescription(`you don't have any ${context.economy.items[parameters[0]].emoji}'s`) }

            embed.setDescription(`${inventory.obtainedText(embed.description)}`);
            context.channel.send(embed);
        },

        async function(context, parameters) {
            console.log(parameters[1]);
        }
    ]
}