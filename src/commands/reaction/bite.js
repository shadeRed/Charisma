module.exports = {
    config: {
        permissions: [],
        description: 'bite someone!',
        hidden: false,
        nsfw: false,
        tags: ['fun'],
        params: [
            { type: 'mention', required: true, name: 'user' }
        ]
    },

    command: async function(imports, parameters) {
        let embed = await imports.reactions.getEmbed('bite', imports.member, await imports.guild.members.fetch(parameters[0]), imports);
        imports.channel.send(embed);
    }
}