let Discord = require('discord.js');
let progressBar = require('progress-string');

function overHour(ms) { return ms >= 3600000 }
function convert(ms, isHours) {
    if (overHour(ms) || isHours) {
        let hours = Math.floor(ms / 3600000);
        let minutes = Math.floor((ms % 3600000) / 60000);
        let seconds = (((ms % 3600000) % 60000) / 1000).toFixed(0);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    else {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

module.exports = {
    config: {
        permissions: [],
        description: `see what's currently playing`,
        hidden: false,
        nsfw: false,
        tags: ['fun', 'music'],
        params: []
    },

    command: async function(context) {
        let embed = new Discord.MessageEmbed();
        embed.setColor(context.local.guild.colors.accent);
        let result = context.music.check(context);
        if (result == -1) {
            if (context.music.instances.get(context.guild.id).playing || context.music.instances.get(context.guild.id).connection.dispatcher.paused) {
                let song = context.music.instances.get(context.guild.id).queue[0];
                embed.setURL(song.video_url);
                embed.setTitle(song.title);
                embed.setThumbnail(song.thumbnail.thumbnails[song.thumbnail.thumbnails.length - 1].url);

                let streamTime = context.music.instances.get(context.guild.id).connection.dispatcher.streamTime - context.music.instances.get(context.guild.id).connection.dispatcher.pausedTime;
                let songLength = song.lengthSeconds * 1000;

                let progress = overHour(songLength) ? `${convert(streamTime, true)}/${convert(songLength)}` : `${convert(streamTime)}/${convert(songLength)}`;
                
                let bar = progressBar({ total: songLength, width: 15, incomplete: ' ', complete: '=', style: function(complete, incomplete) { return `\`[${complete}>${incomplete}]\`` } })
                progress = `${bar(streamTime)} **(${progress})**`;

                let total = 0;
                let queue = context.music.instances.get(context.guild.id).queue;
                for (let q = 0; q < queue.length; q++) { total += queue[q].lengthSeconds * 1000 }
                total -= song.lengthSeconds * 1000;
                if (total > 0) { progress = `${progress}\n${queue.length - 1} songs after this (${convert(total)} total)` }

                let description = song.shortDescription;

                let label = 'progress';
                if (context.music.instances.get(context.guild.id).connection.dispatcher.paused) { label = `${label} [paused]` }
                embed.addField(label, `${progress}`);
                
                embed.addField('description', description.length > 1000 ? description.substring(0, 1000 - 3) + '...' : description);

                embed.setAuthor(song.author.name, song.author.avatar);
                if (song.keywords) { embed.setFooter(song.keywords.join(', ')) }
            }

            else { embed.setDescription(`nothing's currently playing`) }
        }

        else { embed.setDescription(context.music.errors[result]) }

        context.channel.send(embed);
    }
}