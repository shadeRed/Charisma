let Discord = require('discord.js');

let Config = require('./Config.js');
let CommandConfig = require('./CommandConfig.js');

//let CommandContext = require('./CommandContext.js');

let Inventory = require('./Inventory.js');
let Farm = require('./Farm.js');
let Item = require('./Item.js');
let Shop = require('./Shop.js');

let Experience = require('./Experience.js');
let Flavors = require('./Flavors.js');
let Reactions = require('./Reactions.js');
let Data = require('./Data.js');
let Music = require('./Music.js');

let Accept = require('./Accept.js');

let CommandCore = require('./CommandCore.js');

/**
 * @param {string} permission 
 * @param {CommandContext} context 
 */
function permission(permission, context) {
    return { userPerms: true, botPerms: true, master: false }
}

/**
 * 
 * @param {CommandContext} context 
 * @param {*} parameters 
 */
async function command(context, parameters) {}

/**
 * 
 * @param {string} input 
 * @param {CommandContext} context 
 */
async function parameter(input, context) {
    return { pass: true, value: null }
}

class BotContext {
    constructor() {
        this.client = new Discord.Client();
        this.config = new Config();

        //this.inventory = Inventory;
        //this.farm = Farm;

        this.experience = new Experience();
        this.flavors = new Flavors();
        this.reactions = new Reactions();
        this.shop = new Shop();
        this.accept = new Accept();
        this.data = new Data();
        this.music = new Music();

        this.core = {
            command: new CommandCore()
        }

        this.economy = {
            items: new Map([['name', new Item()]]),
            tables: {}
        }
        
        this.requests = new Map([['guild', new Map([['channel', new Map([['user', null]])]])]]);

        /**
         * 
         * @param {Discord.Guild} guild 
         * @param {Discord.TextChannel} channel 
         * @param {Discord.User} user 
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

        /**
         * 
         * @param {string} emote 
         */
        this.itemFromEmoji = function(emote) { return '' }
        
        this.gets = {
            inits: [function() {}],
            data: {}
        }

        this.sets = {
            inits: [function() {}],
            data: {}
        }

        this.commands = {
            functions: new Map([['name', [command]]]),
            configs: new Map([['name', new CommandConfig()]]),
            permissions: {},
            aliases: new Map([['name', 'alias']]),
            parameters: new Map([['name', parameter]])
        }
    }
}

module.exports = BotContext;