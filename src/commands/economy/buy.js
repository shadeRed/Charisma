var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'buy something from the shop',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'item', required: true },
            { type: 'number', required: false, name: 'quantity' }
        ]
    },

    command: async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let name = parameters[0];

        let quantity = 1;
        if (parameters[1]) { quantity = parameters[1] }
        
        let items = context.economy.items;
        let item = items[name];

        let inventory = new context.inventory(context.user.id);
        await inventory.init();

        if (context.shop.isAvailable(name)) {
            let price = context.shop.getPrice(name);
            let balance = inventory.money.get();
            if (balance >= (price * quantity)) {
                if (!inventory.items.get(name) || inventory.items.get(name).length + quantity <= 1000000) {
                    inventory.money.remove(price * quantity);
                    inventory.items.add(name, quantity);
                    embed.setDescription(`you purchased ${item.emoji}x${quantity}`);
                }

                else { embed.setDescription(`you can't buy that much ${item.emoji}`); }
            }

            else { embed.setDescription(`you don't have enough money to buy that`) }
        }

        else { embed.setDescription(`that item isn't available`) }

        embed.setDescription(inventory.obtainedText(embed.description));

        await inventory.append();
        context.channel.send(embed);
    }
}