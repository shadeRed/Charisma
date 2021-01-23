let Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        aliases: ['inv'],
        params: [
            [],
            [ { required: true, type: 'string', requiredValue: 'export' } ]
        ]
    },

    command: [
        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
    
            let fix = false;
    
            let inventory = new context.inventory(context.user.id);
            await inventory.init();
    
            let keys = inventory.keys.getAll();
    
            let keysArr = [];
            for (let k in keys) {
                if (context.economy.items[k]) { keysArr.push(context.economy.items[k].emoji) }
                else { inventory.keys.remove(k); }
            }
            
            let items = inventory.items.getAll();
            let itemsArr = [];
            for (let i in items) {
                if (context.economy.items[i]) { itemsArr.push(`${context.economy.items[i].emoji}x${items[i].length}`) }
                else { fix = true; inventory.items.removeAll(i) }
            }
    
            let keysText;
            if (keysArr.length == 0) { keysText = `you don't have anything equipped` }
            else { keysText = keysArr.join(' ') }
            embed.addField(`equipped`, keysText);
    
            let itemsText;
            if (itemsArr.length == 0) { itemsText = `nothing ;-;` }
            else { itemsText = itemsArr.join(' ') }
            embed.addField(`items`, itemsText);
    
            if (fix) { await inventory.append() }
    
            context.channel.send(embed);
        },

        async function(context) {
            let inventory = new context.inventory(context.user.id);
            await inventory.init();

            let json = JSON.stringify(inventory.data);

            let attachment = new Discord.MessageAttachment(Buffer.from(json, 'utf8'), 'export.json');

            context.channel.send(attachment);
        }
    ]
}