let Discord = require('discord.js');
let BotContext = require('./BotContext.js');
let defaults = require('./../config/defaults.json');
let Config = new (require('./Config.js'))();

class UserId extends String {}
class CommandName extends String {}

class CommandContext extends BotContext {
    constructor() {
        super();

        this.guild = new Discord.Guild();
        this.channel = new Discord.TextChannel();
        this.member = new Discord.GuildMember();
        this.user = new Discord.User();
        this.message = new Discord.Message();

        this.local = {
            guild: defaults.guild,
            user: defaults.user
        }

        this.blacklist = new Map([[new UserId(), new CommandName()]]);
        this.whitelist = new Map([[new CommandName(), new UserId()]]);
    }
}

module.exports = CommandContext;