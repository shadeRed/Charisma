var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'equip a certain item',
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
        if (!inventory.items.has(parameters[0])) { embed.setDescription(`you don't have a ${items[parameters[0]].emoji} to equip`); return context.channel.send(embed) }

        if (inventory.items.get(parameters[0]).length > 1) {
            embed.setAuthor(`which ${items[parameters[0]].emoji} do you want to equip? (1-${inventory.items.get(parameters[0]).length})`)
            let arr = inventory.items.get(parameters[0]);
            for (let a = 0; a < arr.length; a++) { embed.addField(`${items[parameters[0]].emoji} #${a+1}`, 'placeholder text', true) }
            let sent = await context.channel.send(embed);

            let emojis = [ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟' ];
            let promises = [];

            for (let a = 0; a < arr.length; a++) { promises.push(new Promise(function(resolve, reject) { sent.react(emojis[a]).then(resolve).catch(reject) })) }
            await Promise.all(promises);

            let filter = function(reaction, user) {
                if (user.id != context.user.id) { return false }
                if (emojis.includes(reaction.emoji.name) && emojis.indexOf(reaction.emoji.name) <= arr.length) { return true }
            }

            try {
                let reactions = await sent.awaitReactions(filter, { time: 15000, max: 1, errors: ['time'] });
                let r = reactions.first().emoji.name;
                let i = emojis.indexOf(r);

                let newEmbed = new Discord.MessageEmbed();
                newEmbed.setColor(context.local.guild.colors.accent);
                newEmbed.setDescription(`you just equipped ${items[parameters[0]].emoji} (slot ${i+1})`);
                inventory.keys.set(parameters[0], i);
                await inventory.append();
                await sent.edit(newEmbed);
            }

            catch(e) {
                let newEmbed = new Discord.MessageEmbed();
                newEmbed.setColor(context.local.guild.colors.accent);
                newEmbed.setDescription('the selection expired!');
                await sent.edit(newEmbed);
            }
        }

        else {
            inventory.keys.set(parameters[0], 0);
            await inventory.append();
            embed.setDescription(`you equipped ${items[parameters[0]].emoji}`);
            context.channel.send(embed);
        }
    }
}