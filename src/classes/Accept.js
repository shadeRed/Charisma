let { Guild, TextChannel, User, MessageEmbed } = require('discord.js');
//let CommandContext = require('./CommandContext.js');

class Accept {
    constructor() {
        this.requests = new Map([['guild', new Map([['channel', new Map([['user', null]])]])]]);

        /**
         * 
         * @param {Guild} guild 
         * @param {TextChannel} channel 
         * @param {User} user 
         * @param {string} password 
         */
        this.awaitRequest = async function(guild, channel, user, password) { return 0 }

        /**
         * 
         * @param {CommandContext} context 
         * @param {MessageEmbed} embed 
         * @param {function} callback 
         * @param {boolean} hasCode 
         */
        this.request = function(context, embed, callback, hasCode) {}
    }
}

module.exports = Accept;