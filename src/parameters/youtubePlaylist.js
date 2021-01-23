let ytpl = require('ytpl');

module.exports = async function(input, passthrough) {
    var output = { pass: false, value: null }
    
    if (input.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)) {
        try {
            let playlist = await ytpl(input, { limit: Infinity });
            let arr = [];
            for (let i = 0; i < playlist.items.length; i++) { arr.push(playlist.items[i].url_simple) }

            output.pass = true;
            output.value = arr;
        }

        catch(error) {}
    }

    return output;
}