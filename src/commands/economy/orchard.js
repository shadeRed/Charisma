let Discord = require('discord.js');

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;
  
    return `${hours}:${minutes}:${seconds}`;
}

function convert(ms) {
    let seconds = Math.floor(ms / 1000);
    let minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hour = Math.floor(minute / 60);
    minute = minute % 60;
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

module.exports = {
    config: {
        permissions: [],
        description: 'check your orchard of fruit trees!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        aliases: ['trees'],
        params: [
            [],
            [
                { type: 'string', required: true, value: 'status' },
                { type: 'number', required: false, name: 'plot' }
            ]
            //[ { type: 'item', required: true } ]
        ]
    },

    command: [
        async function(context) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);

            let farm = new context.farm(context.user.id);
            await farm.init();

            let count = farm.orchardPlots;
            for (let c = 0; c < count; c++) { embed.addField(`plot #${c+1}`, farm.orchard.getPlotsGrid(c), true) }

            context.channel.send(embed);
        },

        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);

            let items = context.economy.items;

            let i = parameters[0] ? parameters[0] > 0 && parameters[0] < farm.data.orchardPlots ? parameters[0] - 1 : 0 : 0;

            let farm = new context.farm(context.user.id);
            await farm.init();

            let plot = farm.orchard.getPlots()[i];

            let arr = [];

            let t = 0;
            for (let r = 0; r < plot.length; r++) {
                for (let c = 0; c < plot[r].length; c++) {
                    if (plot[r][c] != null) {
                        let tree = plot[r][c];
                        let fruit = tree.fruit;
                        let item = items[fruit];
    
                        let grownAt = item.trees.growth + tree.planted;
                        let harvestAt = tree.harvested + item.trees.harvest;
    
                        if (Date.now() < grownAt) { arr.push(`${item.emoji} #${t+1} - fully grown in: *${convert(grownAt - Date.now())}*`) }
                        else if (tree.harvested != -1 && Date.now() < harvestAt) { arr.push(`${item.emoji} #${t+1} - ready to harvest in: *${convert(harvestAt - Date.now())}*`) }
                        else { arr.push(`${item.emoji} #${t+1} - **ready to harvest!**`) }
                        t++;
                    }
                }
            }

            if (arr.length > 0) {
                embed.setTitle(`status of orchard plot #${i+1}`);
                embed.setDescription(arr.join('\n'));
            }

            else { embed.setDescription(`there's nothing currently planted in **orchard plot #${i+1}**...`) }

            context.channel.send(embed);
        }

        /*async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            
            let name = parameters[0];
            let items = context.economy.items;
            let item = items[name];
            
            if (item.trees) {
                let farm = new context.farm(context.user.id);
                await farm.init();
    
                let trees = farm.orchard.get(name);
    
                let arr = [];
    
                for (let t = 0; t < trees.length; t++) {
                    /*moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    
                    let grownAt = item.trees.growth + trees[t].planted;
                    let harvestAt = trees[t].harvested + item.trees.harvest;
    
                    if (Date.now() < grownAt) { arr.push(`${item.emoji} #${t+1} - fully grown in: *${convert(grownAt - Date.now())}*`) }
                    //else if (trees[t].harvested != -1 && Date.now() < harvestAt) { console.log(true) }
                    else if (trees[t].harvested != -1 && Date.now() < harvestAt) { arr.push(`${item.emoji} #${t+1} - ready to harvest in: *${convert(harvestAt - Date.now())}*`) }
                    else { arr.push(`${item.emoji} #${t+1} - **ready to harvest!**`) }
                    
                    //else { arr.push(`${item.emoji} #${t+1} - harvestable in: ****`) }
                    //if (Date.now() > (item.trees.growth + trees[t].planted)) { arr.push(`${item.emoji} #${t+1} - fully grown in: ${moment(Date.now(), 'HH:mm:ss').diff(item.trees.growth - (trees[t].planted - Date.now())).format('HH:mm:ss')}`) }
                    //else { console.log(item.trees.growth - (trees[t].planted - Date.now())) }
                    //else { arr.push(`${item.emoji} #${t+1} - harvestable in: ${moment(Date.now(), 'HH:mm:ss').diff(item.trees.growth - (trees[t].planted - Date.now())).format('HH:mm:ss')}`) }
                    //arr.push(moment(Date.now(), 'HH:mm:ss').diff(trees))
                }
    
                if (arr.length > 0) { embed.setDescription(arr.join('\n')) }
                else { embed.setDescription(`you don't have any ${item.emoji} trees planted!`) }
            }
    
            else { embed.setDescription(`${item.emoji} isn't a treeable item!`) }
    
            context.channel.send(embed);
        }*/
    ]
}