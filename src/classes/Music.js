let { VoiceConnection } = require('discord.js');
let CommandContext = require('./CommandContext.js');

class Music {
    constructor() {
        this.errors = [''];
        this.instances = new Map([['guild', { playing: true, connection: new VoiceConnection(), queue: [] }]]);

        /**
         * 
         * @param {string} id 
         * @param {string} song 
         */
        this.play = function(id, song) {}

        /**
         * 
         * @param {string} id 
         */
        this.pause = function(id) {}

        /**
         * 
         * @param {string} id 
         */
        this.resume = function(id) {}

        /**
         * 
         * @param {string} id 
         * @param {*} video 
         */
        this.add = function(id, video) {}

        /**
         * 
         * @param {string} id 
         * @param {string[]} arr 
         */
        this.background = async function(id, arr) {}

        /**
         * 
         * @param {CommandContext} context 
         */
        this.check = function(context) { return 0 }
    }
}

module.exports = Music;