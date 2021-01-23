let Discord = require('discord.js');
let gm = require('gm');

module.exports = {
    config: {
        permissions: ['PATREON.BUBBLEGUM'],
        description: 'deepfry an image!',
        hidden: false,
        nsfw: false,
        tags: ['fun', 'image', 'patreon'],
        params: []
    },

    command: async function(context) {
        let image = await context.core.image.getLastImage(context);
        if (image) {
            let magikEmbed = new Discord.MessageEmbed();
            magikEmbed.setColor(context.local.guild.colors.accent);
            try {
                context.channel.startTyping();

                let data = gm(image.buffer, image.attachment.filename);
                data.modulate(120, 400).contrast(10).quality(0.001).sharpen(10, 1);
                let magikBuffer = await context.core.image.gmToBuffer(data);
            
                magikEmbed.attachFiles([{
                    attachment: magikBuffer,
                    name: image.attachment.name
                }]);

                magikEmbed.setImage(`attachment://${image.attachment.name}`);
                context.channel.stopTyping(true);
            }

            catch(error) { magikEmbed.setDescription(`an error occurred while trying to process your image!`) }
            
            context.channel.send(magikEmbed);
        }

        else {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
            embed.setDescription(`no images were found`);
            context.channel.send(embed);
        }
    }
}