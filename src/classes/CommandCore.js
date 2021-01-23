let CommandConfig = require('./CommandConfig.js');
//let CommandContext = require('./CommandContext.js');

class CommandStatus {
    constructor() {
        this.missingPerm = false;
        this.userUsable = true;
        this.botUsable = true;
        this.visible = true;
        this.nsfw = false;
        this.blacklisted = false;
        this.whitelisted = true;
        this.master = false;
        this.cooldown = false;
    }
}

class CommandCore {
    constructor() {
        /**
         * 
         * @param {string} command 
         * @param {CommandContext} context 
         */
        this.get = function(command, context) { return new CommandConfig() }

        /**
         * 
         * @param {string} permission 
         * @param {CommandContext} context 
         */
        this.hasPermission = async function(permission, context) { return { userPerms: true, botPerms: true, master: false } }

        /**
         * 
         * @param {string} command 
         * @param {CommandContext} context 
         */
        this.status = async function(command, context) { return new CommandStatus() }

        /**
         * 
         * @param {any[]} inputs 
         * @param {any[]} params 
         * @param {CommandContext} context 
         */
        this.evaluateParams = async function(inputs, params, context) { return [null] }

        /**
         * 
         * @param {string} name 
         * @param {string[]} parameters 
         * @param {CommandContext} context 
         */
        this.check = async function(name, parameters, context) { return 0 }

        /**
         * 
         * @param {string} prefix 
         * @param {string} command 
         * @param {CommandContext} context 
         */
        this.syntax = function(prefix, command, context) { return '' }
    }
}

module.exports = CommandCore;