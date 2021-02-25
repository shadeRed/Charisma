let Discord = require('discord.js');
let ytdl = require('ytdl-core');
let yts = require('yt-search');
let moment = require('moment');

module.exports = {
    config: {
        permissions: [],
        description: `play a song`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: [
            [ { type: 'string', required: true, name: 'search terms' } ],
            [ { type: 'youtubeVideo', required: true, name: 'YouTube Video URL' } ],
            [ { type: 'youtubePlaylist', required: true, name: 'YouTube Playlist URL' } ]
        ]
    },

    command: [
        // <search terms>
        async function(context, parameters) {
            let result = context.music.check(context);
            if (result == -1) {
                let menuEmbed = new Discord.MessageEmbed();
                menuEmbed.setColor(context.local.guild.colors.accent);
        
                let collection = await yts(parameters[0]);
                let videos = collection.videos.slice(0, 10);
    
                let arr = [];
                for (let v = 0; v < videos.length; v++) { arr.push(`**[${v+1}] - ${videos[v].title} - ${moment.utc(videos[v].duration.seconds*1000).format('HH:mm:ss')}**`) }
                menuEmbed.setDescription(arr.join('\n'));
                menuEmbed.setFooter('pick one by entering 1-10');
                menuEmbed.setAuthor(`results for "${parameters[0]}"`);
                let menuMessage = await context.channel.send(menuEmbed);
    
                try {
                    let response = await context.channel.awaitMessages(message => message.content > 0 && message.content < videos.length+1 && message.author.id == context.user.id, {
                        max: 1,
                        time: 20000,
                        errors: ['time']
                    });
    
                    let video = await ytdl.getBasicInfo(videos[parseInt(response.array()[0].content) - 1].url);
                    
                    let successEmbed = new Discord.MessageEmbed();
                    successEmbed.setColor(context.local.guild.colors.accent);
                    
                    context.music.add(context.guild.id, video.videoDetails);
                    if (context.music.instances.get(context.guild.id).queue >= 1) { successEmbed.setDescription(`added **"${video.videoDetails.title}"** to the queue`) }
                    else { successEmbed.setDescription(`started playing **"${video.videoDetails.title}"**`) }
                    
                    successEmbed.setThumbnail(video.videoDetails.thumbnail.thumbnails[video.videoDetails.thumbnail.thumbnails.length - 1].url);
                    menuMessage.edit(successEmbed);
                }
    
                catch(error) {
                    console.log(error);
                    let errorEmbed = new Discord.MessageEmbed();
                    errorEmbed.setColor(context.local.guild.colors.accent);
                    errorEmbed.setDescription(`no song was selected; canceling selection`);
                    menuMessage.edit(errorEmbed);
                }
            }

            else {
                let embed = new Discord.MessageEmbed();
                embed.setColor(context.local.guild.colors.accent);
                embed.setDescription(context.music.errors[result]);
                context.channel.send(embed);
            }            
        },

        // <YouTube Video URL>
        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
    
            let result = context.music.check(context);
            if (result == -1) {
                let video = await ytdl.getBasicInfo(parameters[0]);
                context.music.add(context.guild.id, video.videoDetails);
                if (context.music.instances.get(context.guild.id).queue.length > 1) { embed.setDescription(`added **"${video.videoDetails.title}"** to the queue`) }
                else { embed.setDescription(`started playing **"${video.videoDetails.title}"**`) }
            }
            

            else { embed.setDescription(`that's an invalid video url`) }

            context.channel.send(embed);
        },

        // <YouTube Playlist URL>
        async function(context, parameters) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);

            let result = context.music.check(context);
            if (result == -1) {
                context.music.background(context.guild.id, parameters[0]);
                embed.setDescription(`**${parameters[0].length}** tracks have been added to the queue`);
            }

            else { embed.setDescription(`that's an invalid playlist url`) }

            context.channel.send(embed);
        }
    ]
}