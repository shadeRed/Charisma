let Discord = require('discord.js');
//let CommandContext = require('./CommandContext.js');

class Reactions {
    constructor() {
        /**
         * 
         * @param {string} type 
         * @param {string} from 
         * @param {string} to 
         * @param {CommandContext} context 
         */
        this.getText = function(type, from, to, context) { return '' }

        /**
         * 
         * @param {string} type 
         */
        this.getUrl = async function(type) { return '' }

        /**
         * 
         * @param {string} type 
         * @param {string} from 
         * @param {string} to 
         * @param {CommandContext} context 
         */
        this.getEmbed = async function(type, from, to, context) { return new Discord.MessageEmbed() }
    }
}

module.exports = Reactions;