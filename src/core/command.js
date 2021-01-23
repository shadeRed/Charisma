var Discord = require('discord.js');
let CommandContext = require('./../classes/CommandContext.js');

module.exports = {
    /**
     * 
     * @param {string} command 
     * @param {CommandContext} passthrough 
     */
    get: function(command, passthrough) { return passthrough.commands.configs.get(command) },

    /**
     * 
     * @param {string} permission 
     * @param {CommandContext} passthrough 
     */
    hasPermission: async function(permission, passthrough) {
        var toReturn;
        async function recur(obj, perm) {
            var path = perm.split('.');
            path = path.filter(Boolean);
            if (obj[path[0]]) {
                if (obj[path[0]] instanceof Function) {
                    if (path[1]) { toReturn = await obj[path[0]](path[1], passthrough) }
                    else { toReturn = await obj[path[0]](path[0], passthrough) }
                }

                else { var shifted = path.shift(); await recur(obj[shifted], path.join('.')) }
            }
        }

        await recur(passthrough.commands.permissions, permission);
        return toReturn;
    },

    /**
     * 
     * @param {string} command 
     * @param {CommandContext} passthrough 
     */
    status: async function(command, passthrough) {
        let config = passthrough.commands.configs.get(command.name);
        if (config) {
            var required = config.permissions;
            var missingPerm = false;
            var userUsable = true;
            var botUsable = true;
            var visible = true;
            var nsfw = false;
            var blacklisted = false;
            var whitelisted = true;
            var master = false;
            var cooldown = false;

            var blacklist = [];
            if (passthrough.local.guild.blacklist[passthrough.member.id]) { blacklist = passthrough.local.guild.blacklist[passthrough.member.id] }
            var whitelist = [];
            if (passthrough.local.guild.whitelist[command.name]) { whitelist = passthrough.local.guild.whitelist[command.name] }

            for (b in blacklist) { if (blacklist[b] == command.name) { blacklisted = true } }
            if (whitelist.length != 0) { if (!whitelist.includes(passthrough.member.id)) { whitelisted = false } }

            for (r in required) {
                var permission = await this.hasPermission(required[r], passthrough);
                if (!permission.userPerms) { missingPerm = true }
                if (!permission.botPerms) { botUsable = false }
                if (permission.master) { master = true }

                if (Discord.Permissions.FLAGS[required[r]]) {
                    if (!passthrough.member.hasPermission(Discord.Permissions.FLAGS[required[r]])) { missingPerm = true }
                    if (!passthrough.guild.me.hasPermission(Discord.Permissions.FLAGS[required[r]])) { botUsable = false }
                }
            }

            if (blacklisted || !whitelisted || missingPerm ) { userUsable = false }
            if (missingPerm) { userUsable = false }
            if (config.cooldown) {
                if (!passthrough.local.user.cooldowns[command.name]) { passthrough.local.user.cooldowns[command.name] = -1 }
                var usedWhen = passthrough.local.user.cooldowns[command.name];
                var date = new Date();
                var now = date.getTime();
                if (usedWhen != -1) {
                    var difference = now - usedWhen;

                    if (difference < config.cooldown) { cooldown = true; userUsable = false; }
                }
            }

            if (config.hidden) { visible = false }
            if (config.nsfw) { nsfw = true }

            if (nsfw && !passthrough.channel.nsfw) { userUsable = false }

            return {
                userUsable: userUsable,
                botUsable: botUsable,

                visible: visible,
                nsfw: nsfw,

                missingPerm: missingPerm,

                blacklisted: blacklisted,
                whitelisted: whitelisted,
                cooldown: cooldown,
                master: master
            }
        }
    },

    /**
     * 
     * @param {any[]} inputs 
     * @param {any[]} params 
     * @param {CommandContext} passthrough 
     */
    evaluateParams: async function(inputs, params, passthrough) {
        let toReturn = [];
        for (let i = 0; i < inputs.length; i++) {
            if (i < params.length) {
                if (passthrough.commands.parameters.get(params[i].type).constructor.name == 'AsyncFunction') {
                    let result = await passthrough.commands.parameters.get(params[i].type)(inputs[i], passthrough);
                    toReturn.push(result.value);
                }
    
                else { toReturn.push(passthrough.commands.parameters.get(params[i].type)(inputs[i], passthrough).value) }
            }

            else { toReturn[toReturn.length - 1] = `${toReturn[toReturn.length - 1]} ${inputs[i]}` }
        }

        return toReturn;
    },

    /**
     * 
     * @param {string} name 
     * @param {any[]} parameters 
     * @param {CommandContext} passthrough 
     */
    check: async function(name, parameters, passthrough) {
        let config = passthrough.commands.configs.get(name);

        for (let c = config.params.length - 1; c >= 0; c--) {
            let error = false;
            for (let p = 0; p < config.params[c].length; p++) {
                if (parameters[p]) {
                    let checkFunc = passthrough.commands.parameters.get(config.params[c][p].type);
                    let checked;
                    if (checkFunc.constructor.name == 'AsyncFunction') { checked = await checkFunc(parameters[p], passthrough) }
                    else { checked = checkFunc(parameters[p], passthrough) }

                    if (!checked.pass) { error = true; break; }

                    if (config.params[c][p].value) { if (config.params[c][p].value != checked.value) { error = true; break; } }
                }

                else if (config.params[c][p].required) { error = true; break; }
            }

            if (!error) { return c }
        }

        if (config.params.length == 0) { return 0 }

        return -1;
    },

    /**
     * 
     * @param {string} prefix 
     * @param {string} command 
     * @param {CommandContext} passthrough 
     */
    syntax: function(prefix, command, passthrough) {
        let config = passthrough.commands.configs.get(command);
        if (config) {
            let syntax = config.params.length == 0 ? [[`${prefix + command}`]] : [];
            if (config.params && config.params.length > 0) {
                for (let p = 0; p < config.params.length; p++) {
                    syntax.push([`${prefix + command}`]);
                    for (let pp = 0; pp < config.params[p].length; pp++) {
                        let insert = config.params[p][pp].type;
                        if (config.params[p][pp].name) { insert = config.params[p][pp].name }
                        if (config.params[p][pp].value != undefined && typeof config.params[p][pp].value == 'string') {
                            if (config.params[p][pp].required) { syntax[p].push(config.params[p][pp].value) }
                            else { syntax[p].push(`${config.params[p][pp].value}?`) }
                        }

                        else {
                            if (config.params[p][pp].required) { syntax[p].push(`<${insert}>`) }
                            else { syntax[p].push(`[${insert}]`) }
                        }
                    }
                }
            }

            let arr = [];
            for (let s = 0; s < syntax.length; s++) { arr.push(syntax[s].join(' ')) }

            return arr.join('\n');
        }
    }
}