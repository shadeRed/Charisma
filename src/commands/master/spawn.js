var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: ['BOT.MASTER'],
        description: 'spawn things with magic or something',
        hidden: false,
        nsfw: false,
        params: [
            [
                { type: 'string', required: true, value: 'money' },
                { type: 'number', required: true, name: 'amount' },
                { type: 'mention', required: false } 
            ],

            [
                { type: 'string', required: true, value: 'experience' },
                { type: 'number', required: true, name: 'amount' }
            ],

            [
                { type: 'string', required: true, value: 'item' },
                { type: 'item', required: true },
                { type: 'number', required: false, name: 'quantity' },
                { type: 'mention', required: false } 
            ]
        ]
    },

    command: [
        // money <amount> [mention]
        async function(context, parameters) {
            var embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            var member = context.member;
            if (parameters[2]) { member = await context.guild.members.fetch(parameters[2]) }
    
            let inventory = new context.inventory(member.id);
            await inventory.init();
            inventory.money.add(parameters[1]);
            await inventory.append();

            embed.setDescription(`added **$${parameters[1]}** to **${member.user.tag}'s** balance`);
            context.channel.send(embed);
        },

        // experience <amount>
        async function(context, parameters) {
            var embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);

            context.experience.add(context, parameters[1]);
            embed.setDescription(`added **${parameters[1]} experience** to **${context.user.username}#${context.user.discriminator}**`);
    
            context.channel.send(embed);
        },

        // item <item> [quantity] [mention]
        async function(context, parameters) {
            var embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            var member = context.member;
            if (parameters[3]) { member = await context.guild.members.fetch(parameters[3]) }
    
            let item = parameters[1];

            let count = parameters[2] || 1;
            //if (parameters[2]) { count = parameters[2] }
            //if (count < 1) { count = 1 }

            let inventory = new context.inventory(member.id);
            await inventory.init();
            inventory.items.add(item, count);
            await inventory.append();

            if (member.id == context.user.id) { embed.setDescription(`you gave yourself ${count}x${context.economy.items[item].emoji}`) }
            else { embed.setDescription(`**${member.user.tag}** was given ${count}x${context.economy.items[item].emoji}`) }

            context.channel.send(embed);
        }
    ]
}