//let CommandContext = require('./CommandContext.js');

class Experience {
    constructor() {
        /**
         * 
         * @param {number} level 
         * @param {number} factor 
         */
        this._get = function(level, factor) { return 0 }

        /**
         * 
         * @param {number} exp 
         * @param {number} factor 
         */
        this.expToLevel = function(exp, factor) { return 0 }

        /**
         * 
         * @param {number} level 
         * @param {number} factor 
         */
        this.levelToExp = function(level, factor) { return 0 }

        /**
         * 
         * @param {number} exp 
         * @param {number} factor 
         */
        this.getRelative = function(exp, factor) { return [0, 0] }

        /**
         * 
         * @param {CommandContext} context 
         * @param {number} exp 
         */
        this.add = async function(context, exp) {}
    }
}

module.exports = Experience;