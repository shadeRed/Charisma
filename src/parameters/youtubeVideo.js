let ytdl = require('ytdl-core');

module.exports = async function(input, passthrough) {
    var output = { pass: false, value: null }
    
    if (input.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {
        try {
            let video = await ytdl.getBasicInfo(input);
            output.pass = true;
            output.value = video.videoDetails.video_url;
        }

        catch(error) {}
    }

    return output;
}