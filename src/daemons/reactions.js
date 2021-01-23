let Discord = require('discord.js');

module.exports = function(imports) {
    imports.reactions = {
        getText: function(type, from, to, passthrough) {
            var special;
            let output;
            switch (type) {
                case 'hug': special = 'hugged'; break;
                case 'pat': special = 'pat'; break;
                case 'poke': special = 'poked'; break;
                case 'kiss': special = 'kissed'; break;
                case 'cuddle': special = 'cuddled'; break;
                case 'slap': special = 'slapped'; break;
                case 'bite': special = 'bit'; break;
                case 'lick': special = 'licked'; break;
                case 'tickle': special = 'tickled'; break;
                case 'nuzzle': special = 'nuzzled'; break;
            }

            var fromName = from.displayName;
            var toName = to.displayName;

            if (passthrough.flavors.get(passthrough.local.guild.config.flavor)[type]) {
                if (passthrough.user.id == to.id) {
                    output = imports.flavors.variables(imports.flavors.pick(passthrough.local.guild.config.flavor, type, 'self'),
                    [{ name: 'user', value: from.displayName }]);
                }

                else if (to.id == passthrough.client.user.id) {
                    output = imports.flavors.variables(imports.flavors.pick(passthrough.local.guild.config.flavor, type, 'bot'),
                    [{ name: 'user', value: from.displayName }]);
                }

                else {
                    output = imports.flavors.variables(imports.flavors.pick(passthrough.local.guild.config.flavor, type, 'standard'),
                    [{ name: 'user', value: from.displayName }, { name: 'target', value: to.displayName }])
                }

            }

            else { output = `**${fromName}** just ${special} **${toName}**~!` }

            return output;
        },

        getUrl: async function(type) {
            return await imports.tenor.randomGif(`anime ${type}`);
        },

        getEmbed: async function(type, from, to, passthrough) {
            let text = imports.reactions.getText(type, from, to, passthrough);
            let url = await imports.reactions.getUrl(type);

            let embed = new Discord.MessageEmbed();
            embed.setColor(passthrough.local.guild.colors.accent);
            embed.setDescription(text);
            embed.setImage(url);

            return embed;
        }
    }
}