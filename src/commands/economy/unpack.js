var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'unpack a container',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'item', required: true },
            { type: 'number', required: false, name: 'slot' }
        ]
    },

    command: async function(context, parameters) {
        let items = context.economy.items;
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);

        if (!items[parameters[0]].tags.includes('container')) { embed.setDescription(`${items[parameters[0]].emoji} isn't a container item`); return context.channel.send(embed) }

        let inventory = new context.inventory(context.user.id);
        await inventory.init();

        if (!inventory.containers.has(parameters[0])) { embed.setDescription(`you don't have a ${items[parameters[0]].emoji} to unpack`); return context.channel.send(embed) }
        if (parameters[1] < 1) { embed.setDescription(`please pick a valid slot number`); return context.channel.send(embed) }
        if (parameters[1] > inventory.containers.get(parameters[0]).length) { embed.setDescription(`that slot number is too high`); return context.channel.send(embed) }

        let slot = 0;
        if (parameters[1]) { slot = parameters[1] - 1 }
        let item = inventory.containers.get(parameters[0])[slot];

        let boxed = [];
        for (let i in item.items) { boxed.push(`${items[i].emoji}x${item.items[i]}`) }
        
        embed.setDescription(`are you sure you want to unpack ${items[parameters[0]].emoji}${!item.origin ? '' : item.origin != context.user.id ? '' : `(${boxed.join(' ')})`}?`);

        context.request(context, embed, async function(sent) {
            let response = new Discord.MessageEmbed();
            response.setColor(sent.embeds[0].hexColor);
            await inventory.refresh();

            try {
                inventory.containers.remove(parameters[0], slot);
                for (let i in item.items) { inventory.items.add(i, item.items[i]) }
                await inventory.append();
                response.setDescription(`you opened the ${items[parameters[0]].emoji} and got:\n${boxed.join(' ')}`);
            }

            catch(e) { console.error(e); response.setDescription(`an error occured while unpacking`) }

            sent.edit(response);
        });
    }
}