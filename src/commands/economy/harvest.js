var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'harvest something!',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        params: [
            [
                { type: 'string', required: true, value: 'all' },
                { type: 'string', required: true, value: 'trees' },
            ],

            [
                { type: 'string', required: true, value: 'all' },
                { type: 'string', required: true, value: 'trees' },
                { type: 'string', required: true, value: 'in' },
                { type: 'string', required: true, value: 'plot' },
                { type: 'number', required: true, name: 'plot' },
            ],

            [
                { type: 'string', required: true, value: 'all' },
                { type: 'item', required: true, name: 'tree fruit' },
                { type: 'string', required: true, value: 'trees' },
            ],

            [
                { type: 'string', required: true, value: 'all' },
                { type: 'item', required: true, name: 'tree fruit' },
                { type: 'string', required: true, value: 'trees' },
                { type: 'string', required: true, value: 'in' },
                { type: 'string', required: true, value: 'plot' },
                { type: 'number', required: true, name: 'plot' },
            ],

            //[ { type: 'item', required: true } ]
        ]
    },

    command: [
        // all trees
        async function(context) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            
            let farm = new context.farm(context.user.id);
            await farm.init();

            //  { fruit: tree.fruit, yield: 0, died: false }

            let items = context.economy.items;

            let plots = farm.orchard.getPlots();

            for (let p = 0; p < plots.length; p++) {
                let harvests = {};
                let deaths = {};

                for (let r = 0; r < plots[p].length; r++) {
                    for (let c = 0; c < plots[p][r].length; c++) {
                        if (plots[p][r][c]) {
                            let obj = farm.orchard.harvest((p*9)+(r*3)+c);
                            if (obj) {
                                if (!harvests[obj.fruit]) { harvests[obj.fruit] = obj.yield } else { harvests[obj.fruit] += obj.yield }
                                if (obj.died) { if (!deaths[obj.fruit]) { deaths[obj.fruit] = 1 } else { deaths[obj.fruit]++ } }
                            }
                        }
                    }
                }

                let totals = [];
                for (let h in harvests) { totals.push(`${items[h].emoji}x${harvests[h]}`) }

                let str = `harvested: ${totals.length > 0 ? totals.join(' ') : '`nothing`'}`;

                if (Object.keys(deaths).length > 0) {
                    let arr = [];
                    for (let d in deaths) { arr.push(`${deaths[d]} of your ${items[d].emoji} trees`) }
                    str += `\n\nhowever, the following trees have sadly perished:\n${arr.join('\n')}`;
                }

                embed.addField(`plot #${p+1}`, str);
            }

            await farm.append();

            context.channel.send(embed);
        },

        // all trees in plot <plot>
        async function(context) {

        },

        // <tree fruit> trees
        async function(context, parameters) {

        },

        // <tree fruit> trees in plot <plot>
        async function(context, parameters) {

        }

        /**async function(context, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        
        let name = parameters[0];
        let items = context.economy.items;
        let item = items[name];
        
        if (item.trees || item.plant) {
            let inventory = new context.inventory(context.user.id);
            await inventory.init();
            
            if (item.trees) {
                let farm = new context.farm(context.user.id);
                await farm.init();

                trees = farm.orchard.get(name);

                if (trees.length > 0) {
                    let arr = farm.orchard.harvest(name);
                    let total = 0;
                    let deaths = 0;
                    let harvested = 0;
                    for (let a = 0; a < arr.length; a++) {
                        total += arr[a].yield;
                        deaths += arr[a].died == true ? 1 : 0;
                        harvested += arr[a].yield > 0 ? 1: 0;
                    }

                    if (total > 0) {
                        embed.setDescription(`after a lot of hard work, you harvested: ${harvested} ${item.emoji} trees and got ${item.emoji}x${total}${deaths == 0 ? '' : `, however... ${deaths} of your ${item.emoji} trees ${deaths > 1 ? 'have' : 'had'} sadly perished...`}`);
                        inventory.items.add(name, total);

                        await inventory.append();
                        await farm.append();
                    }   

                    else { embed.setDescription(`you don't have any ${item.emoji} trees planted...`) }
                }

                else { embed.setDescription(`you don't have any ${item.emoji} trees planted...`) }
            }
    
            else if (item.plant) {
                
            }
        }

        else { embed.setDescription(`${item.emoji} isn't a plantable item!`) }

        context.channel.send(embed);
    } */
    ]
}