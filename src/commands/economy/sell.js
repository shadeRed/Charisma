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

            if (!(context.economy.items[parameters[0]].tags.includes('key') || context.economy.items[parameters[0]].tags.includes('container'))) {
                if (inventory.items.has(parameters[0])) {
                    if (inventory.items.get(parameters[0]) < quantity) { embed.setDescription(`you don't have ${context.economy.items[parameters[0]].emoji}x${quantity}`) }
                    else {
                        let value = context.shop.getValue(parameters[0]);
                        let total = value * quantity;
    
                        inventory.items.remove(parameters[0], quantity);
                        let individuals = quantity == 1 ? '' : ` *(${Math.floor(total / quantity)}g each)*`;
    
                        inventory.money.add(total);
                        await inventory.append();
    
                        embed.setDescription(`you sold ${context.economy.items[parameters[0]].emoji}x${quantity} and got **${total}g**${individuals}`);
                    }
                }
    
                else { embed.setDescription(`you don't have any ${context.economy.items[parameters[0]].emoji}'s`) }
            }

            else { embed.setDescription(`${context.economy.items[parameters[0]].emoji} isn't a sellable item`) }

            embed.setDescription(`${inventory.obtainedText(embed.description)}`);
            context.channel.send(embed);
        },

        async function(context, parameters) {
            console.log(parameters[1]);
        }
    ]
}