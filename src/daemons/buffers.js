let fs = require('fs');

module.exports = function(context) {
    context.buffers = {
        local_arrow: fs.readFileSync(`${__dirname}/../images/local_arrow.png`),
        global_arrow: fs.readFileSync(`${__dirname}/../images/global_arrow.png`)
    }
}