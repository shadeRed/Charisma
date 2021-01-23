var Discord = require('discord.js');

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = {
    config: {
        permissions: [],
        description: `see what's in the shop!`,
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            [
                { type: 'number', required: false, name: 'page' }
            ],

            [
                { type: 'string', required: true, name: 'search' },
                { type: 'number', required: false, name: 'page' }
            ]
        ]
    },

    command: [
        // [page]
        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            embed.setTitle('shop');
    
            let items = context.economy.items;
            let shoppables = {};
            for (let i in items) {
                if (items[i].shoppable) {
                    if (context.shop.isAvailable(i)) {
                        shoppables[i] = clone(items[i]);
                        shoppables[i].value = context.shop.getPrice(i);
                    }
                }
            }
    
            let page = 0;
            if (parameters[0]) { page = parameters[0] - 1 }
    
            let shoppableArray = [];
            let names = [];
            for (let s in shoppables) {
                shoppableArray.push(shoppables[s]);
                names.push(s);
            }
    
            let resultArray = [];
            let maxPage = Math.ceil(shoppableArray.length / 20) - 1;
            if (page > maxPage) { embed.setDescription(`please specify a smaller page number`) }
            else {
                for (var i = 0; i < 20; i++) {
                    if (shoppableArray[(page * 20) + i]) {
                        resultArray.push(`${shoppableArray[(page * 20) + i].emoji} ${names[(page * 20) + i]} **$${shoppableArray[(page * 20) + i].value}**`)
                    }
                }
            }
    
            embed.setDescription(resultArray.join('\n'));
            embed.setFooter(`page ${page+1}/${maxPage+1}`)

            context.channel.send(embed);
        },

        // <search> [page]
        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            embed.setTitle('shop');
    
            let items = context.economy.items;
            let shoppables = {};
            for (let i in items) {
                if (items[i].shoppable) {
                    if (context.shop.isAvailable(i)) {
                        shoppables[i] = clone(items[i]);
                        shoppables[i].value = context.shop.getPrice(i);
                    }
                }
            }

            for (let s in shoppables) { if (!shoppables[s].tags.includes(parameters[0])) { delete shoppables[s] } }
            if (parameters[1]) { if (!isNaN(parameters[1])) { page = parseInt(parameters[1]) - 1 } }
    
            let page = 0;
            if (parameters[1]) { page = parameters[1] - 1 }
    
            let shoppableArray = [];
            let names = [];
            for (var s in shoppables) {
                shoppableArray.push(shoppables[s]);
                names.push(s);
            }
    
            let resultArray = [];
            let maxPage = Math.ceil(shoppableArray.length / 20) - 1;
            if (page > maxPage) { embed.setDescription(`please specify a smaller page number`) }
            else {
                for (var i = 0; i < 20; i++) {
                    if (shoppableArray[(page * 20) + i]) {
                        resultArray.push(`${shoppableArray[(page * 20) + i].emoji} ${names[(page * 20) + i]} : **$${shoppableArray[(page * 20) + i].value}**`);
                    }
                }
            }
    
            embed.setDescription(resultArray.join('\n'));
            if (maxPage != 0) { embed.setFooter(`page ${page+1}/${maxPage+1}`) }
            if (!embed.description) { embed.setDescription(`no items match your query`); embed.setTitle(''); }
            context.channel.send(embed);
        }
    ]
}