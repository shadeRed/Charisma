var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'plant something!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [ { type: 'item', required: true } ]
    },

    command: async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let name = parameters[0];
        let items = context.economy.items;
        let item = items[name];

        let inventory = new context.inventory(context.user.id);
        await inventory.init();
        
        if (item.trees || item.plant) {
            if (inventory.items.has(name)) {
                if (item.trees) {
                    let farm = new context.farm(context.user.id);
                    await farm.init();

                    let count = farm.orchardPlots;
                    let trees = farm.orchard.get();

                    if (trees.length < (count*9)) {
                        let success = farm.orchard.plant(name, {});
                        if (success) {
                            embed.setDescription(`you just planted a ${item.emoji} tree!`);
                            await farm.append();
                        }

                        else { embed.setDescription(`you tried to plant a ${item.emoji} but it withered away in the process...`) }

                        inventory.items.remove(name);
                        await inventory.append();
                    }

                    else { embed.setDescription(`you can't grow any more trees...`) }      
                }
        
                else if (item.plant) {
                    
                }
            }

            else { embed.setDescription(`you don't have a ${item.emoji} to plant!`) }
        }

        else { embed.setDescription(`${item.emoji} isn't a plantable item!`) }

        context.channel.send(embed);
    }
}