let ytdl = require('ytdl-core');
let BotContext = require('./../classes/BotContext.js');

/**
 * 
 * @param {BotContext} context 
 */
module.exports = function(context) {
    context.music = {
        errors: [
            `you're not in a voice channel`,
            `I'm not in a voice channel`,
            `I'm not in that voice channel`,
            `I don't have permission to speak in this channel`
        ],

        instances: new Map(),
        play: function(id, song) {
            if (song) {
                context.music.instances.get(id).playing = true;
                let stream = ytdl(context.music.instances.get(id).queue[0].video_url, { filter: 'audioonly', quality: 'highestaudio' });
                context.music.instances.get(id).connection.play(stream);
                context.music.instances.get(id).connection.dispatcher.setVolume(context.music.instances.get(id).volume/100);
                context.music.instances.get(id).connection.dispatcher.on('finish', function(reason) {
                    if (context.music.instances.get(id)) {
                        if (reason != 'noShift') { context.music.instances.get(id).queue.shift() }
                        context.music.play(id, context.music.instances.get(id).queue[0]);
                    }
                });

                context.music.instances.get(id).connection.dispatcher.on('error', function(error) {
                    console.error(error);
                    console.error(`restarting audio dispatcher in guild: ${id}`);
                    if (!context.music.instances.get(id).connection.dispatcher) { context.music.play(id, context.music.instances.get(id).queue[0]) }
                });
            }

            else { context.music.instances.get(id).playing = false }
        },

        pause: function(id) {
            context.music.instances.get(id).playing = false;
            context.music.instances.get(id).connection.dispatcher.pause(true);
        },

        resume: function(id) {
            context.music.instances.get(id).playing = true;
            context.music.instances.get(id).connection.dispatcher.resume();
        },

        add: function(id, video) {
            context.music.instances.get(id).queue.push(video);
            if (!context.music.instances.get(id).playing && !(context.music.instances.get(id).connection.dispatcher && context.music.instances.get(id).connection.dispatcher.paused)) { if (context.music.instances.get(id).queue.length == 1) { context.music.play(id, video) } }
        },

        background: async function(id, arr) {
            for (let a = 0; a < arr.length; a++) {
                try {
                    let video = await ytdl.getBasicInfo(arr[a]);
                    context.music.add(id, video.videoDetails);
                }

                catch(e) {}
            }
        },

        check: function(context) {
            if (context.member.voice.channelID) {
                if (context.guild.me.voice.channelID) {
                    if (context.member.voice.channelID == context.guild.me.voice.channelID) {
                        if (context.member.voice.channel.permissionsFor(context.client.user).has('SPEAK')) {
                            return -1;
                        }
        
                        else { return 3 }
                    }
        
                    else { return 2 }
                }
        
                else { return 1 }
            }
        
            else { return 0 }
        }
    }
}