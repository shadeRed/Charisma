var Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'accept something!',
        hidden: false,
        nsfw: false,
        tags: ['management', 'utility'],
        params: [
            { type: "string", required: false, "name": "password" },
        ]
    },

    command: async function(imports, parameters) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(imports.local.guild.colors.accent);

        let guild = imports.guild.id;
        let channel = imports.channel.id;
        let user = imports.user.id;
        if (imports.requests.get(guild) && imports.requests.get(guild).get(channel) && imports.requests.get(guild).get(channel).get(user) != undefined) {
            let isPassword = imports.requests.get(guild).get(channel).get(user) != false;
            let accepted = false;
            if (isPassword) { if (parameters[0] && parameters[0] == imports.requests.get(guild).get(channel).get(user)) { accepted = true } }
            else { accepted = true }

            if (!accepted) { embed.setDescription(`incorrect password`) }
            else { imports.requests.get(guild).get(channel).set(user, true) }
        }

        else { embed.setDescription(`there's no pending requests`) }

        if (embed.description) { imports.channel.send(embed) }
    }
}