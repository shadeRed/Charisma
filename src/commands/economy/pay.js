var Discord = require('discord.js');
var emoji = require('node-emoji');

module.exports = {
    config: {
        permissions: [],
        description: 'pay someone some money!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            { type: 'mention', required: true, name: 'user' },
            { type: 'number', required: true, name: 'money' }
        ]
    },

    command: async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);

        let user = (await context.guild.members.fetch(parameters[0])).user;
        if (user.id == context.user.id) { embed.setDescription(`you can't pay yourself`); return context.channel.send(embed) }

        let from = new context.inventory(context.user.id);
        await from.init();

        if (parameters[1] > from.money.get()) { embed.setDescription(`you don't have that much in your balance`); return context.channel.send(embed) }

        let to = new context.inventory(user.id);
        await to.init();

        if (parameters[1] > 5000) {
            embed.setDescription(`you're attempting to pay someone more than **$5000**`);
            context.request(context, embed, async function(sent) {
                let response = new Discord.MessageEmbed();
                response.setColor(context.local.guild.colors.accent);
                response.setDescription(`you payed **${user.tag} $${parameters[1]}**~!`);

                await from.refresh();
                await to.refresh();

                await from.money.remove(context, context.user.id, parameters[1]);
                await to.money.add(context, user.id, parameters[1]);

                await from.append();
                await to.append();

                sent.edit(response);
            }, true);
        }

        else {
            embed.setDescription(`you payed **${user.tag} $${parameters[1]}**~!`);

            from.money.remove(parameters[1]);
            to.money.add(parameters[1]);
            
            await from.append();
            await to.append();
            
            context.channel.send(embed);
        }
    }
}