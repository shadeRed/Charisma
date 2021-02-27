let Discord = require('discord.js');

let colors = {
    local: '#6190ff',
    global: '#ffed61'
}

let emoji = {
    local: '751542184246771903',
    global: '751542184418738216'
}

module.exports = function(context) {
    context.experience = {
        _get: function(level, factor) {
            return Math.floor((800 * Math.pow(level + 1, factor)) / 5) + 200;
            //return Math.floor((500 * (Math.pow((level + 1) / 7, factor)) / 5));
            //return Math.floor(((500 * (Math.pow(factor + 0.8, (level + 1) / 3))) / 5));
        },

        expToLevel: function(exp, factor) {
            let level = 0;
            //let required = Math.floor((500 * (factor / 2)) * Math.pow(1, factor));
            let required = this._get(level + 1, factor);
            while (exp > required) {
                exp -= required;
                level += 1;
                //required = Math.floor((500 * (factor / 2)) * Math.pow(level + 1, factor));
                required = this._get(level + 1, factor);
            }
    
            return level;
        },
    
        levelToExp: function(level, factor) {
            let exp = 0;
            for (let l = 0; l < level; l++) {
                exp += this._get(l + 1, factor);
                //exp += Math.floor((500 * (factor / 2)) * Math.pow(l + 1, factor));
            }
    
            return exp;
        },

        getRelative: function(exp, factor) {
            let level = this.expToLevel(exp, factor);
            let currentExp = this.levelToExp(level, factor);
            let nextExp = this.levelToExp(level + 1, factor);
            let relativeExp = exp - currentExp;
            let relativeMax = nextExp - currentExp;
    
            return [relativeExp, relativeMax];
        },

        add: async function(imports, exp) {
            let expData = await imports.data.experience.get(imports.user.id);

            async function processExp(scope) {
                let factor;
                if (scope == 'local') { factor = imports.local.guild.leveling.localCurve }
                else if (scope == 'global') { factor = 4 }

                let curExp;
                if (scope == 'local') {
                    if (!expData.member[imports.guild.id]) { expData.member[imports.guild.id] = 0 }
                    curExp = expData.member[imports.guild.id];
                }

                else if (scope == 'global') { curExp = expData.user }

                let before = context.experience.expToLevel(curExp, factor);
                let after = context.experience.expToLevel(curExp + exp, factor);

                if (scope == 'local') { expData.member[imports.guild.id] += exp }
                else if (scope == 'global') { expData.user += exp }

                if (after > before) {
                    if (imports.local.guild.leveling[`${scope}NotificationMode`] == 'full') {
                        let embed = new Discord.MessageEmbed();
                        embed.setColor(colors[scope]);

                        embed.attachFiles([{
                            attachment: imports.buffers[`${scope}_arrow`],
                            name: 'arrow.png'
                        }]);

                        embed.setFooter(`level up (${scope})`, 'attachment://arrow.png');

                        if ((after - before) == 1) { embed.setDescription(`**${imports.user.tag}** has advanced to **level ${after}**`) }
                        else { embed.setDescription(`**${imports.user.tag}** has skipped **${after - before} levels** and advanced to **level ${after}**`) }
                        imports.channel.send(embed);
                    }

                    else if (imports.local.guild.leveling[`${scope}NotificationMode`] == 'discrete') {
                        imports.message.react(emoji[scope]);
                    }
                }
            }

            if (imports.local.guild.options.leveling) { await processExp('local') }
            await processExp('global');

            await imports.data.experience.update(imports.user.id, expData);
        },
    }
}