let Discord = require('discord.js')
class ImageCore {
    constructor() {
        /**
         * 
         * @param {GMData} data 
         */
        this.gmToBuffer = async function(data) { return new Buffer() }

        /**
         * 
         * @param {CommandContext} context 
         */
        this.getLastImage = async function(context) { return { attachment: new Discord.MessageAttachment(), buffer: new Buffer() } }
    }
}

module.exports = ImageCore;