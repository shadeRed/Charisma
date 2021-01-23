var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'inspect something in your inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            [
                { type: 'string', required: true, value: 'item' },
                { type: 'item', required: true, name: 'item' },
                { type: 'number', required: false, name: 'slot' }
            ],

            [
                { type: 'string', required: true, value: 'key' },
                { type: 'item', required: true, name: 'item' }
            ]
        ]
    },

    command: [
        async function(context, parameters) {
            let items = context.economy.items;

            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            let inspected;
            let inventory = await context.data.inventory.get(context.user.id);
            if (inventory.items[parameters[1]]) {
                let slot = 0;
                if (parameters[2]) { slot = parseInt(parameters[2]) - 1 }
                if (slot < 0 || (inventory.items[parameters[1]] && slot > inventory.items[parameters[1]].length - 1)) { slot = 0 }
                inspected = inventory.items[parameters[1]][slot];
                embed.setFooter(`${parameters[1]} @ items > slot ${slot+1}`);
            }

            else { embed.setDescription(`you don't have that in an item slot!`) }

            if (inspected) {
                if (inspected.items) {
                    let contains = {};
                    let containsArr = [];
                    for (let i in inspected.items) {
                        if (!contains[i]) { contains[i] = 0 }
                        contains[i] += 1;
                    }

                    for (let c in contains) { containsArr.push(`${items[c].emoji}x${contains[c]}`) }
                    if (containsArr.length == 0) { containsArr.push(`<empty>`) }

                    embed.addField(`contains`, containsArr.join(' '), true);
                }
            }
    
            context.channel.send(embed);
        },

        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            let inspected;
            let inventory = await context.data.inventory.get(context.user.id);
    
            if (inventory.key[parameters[1]]) { inspected = inventory.key[parameters[1]] }
            else { embed.setDescription(`you don't have that item in a key slot!`) }

            if (inspected) {
                if (inspected.items) {
                    let contains = {};
                    let containsArr = [];
                    for (let i in inspected.items) {
                        if (!contains[i]) { contains[i] = 0 }
                        contains[i] += 1;
                    }

                    for (let c in contains) { containsArr.push(`${items[c].emoji}x${contains[c]}`) }
                    if (containsArr.length == 0) { containsArr.push(`<empty>`) }

                    embed.addField(`contains`, containsArr.join(' '), true);
                }
            }
    
            context.channel.send(embed);
        }
    ]
}