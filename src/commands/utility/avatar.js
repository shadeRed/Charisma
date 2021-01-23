let Discord = require('discord.js');

module.exports = {
    config: {
        permissions: [],
        description: 'get a users avatar',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [ { type: 'mention', required: false } ]
    },

    command: async function(imports, parameters) {
        var embed = new Discord.MessageEmbed();
        embed.setColor(imports.local.guild.colors.accent);
    
        let id = imports.user.id;
        if (parameters[0]) { id = parameters[0] }

        let member = await imports.guild.members.fetch(id);
        let avatar = member.user.avatarURL({ dynamic: true });

        embed.setImage(avatar);

        imports.channel.send(embed);
    }
}