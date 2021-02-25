var Discord = require('discord.js');
var moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

function sleep(ms) {
    return new Promise(function(resolve, reject) { setTimeout(resolve, ms) });
}

function clone(obj) {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) { copy[i] = clone(obj[i]) }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) { if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]) }
        return copy;
    }

    throw new Error(`unable to copy obj! it's type isn't supported`);
}

function size(obj) {
    let s = 0, key;
    for (key in obj) { if (obj.hasOwnProperty(key)) s++ }
    return s;
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function percentageOf(num, percentage) {
    return (percentage / 100) * num;
}

module.exports = async function(imports, message) {
    if (message.author.bot) { return }
    var guild;
    var user;
    if (!imports.data) {
        guild = imports.config.defaults.guild;
        user = imports.config.defaults.user;
    }

    else {

        function iterate(base, obj) {
            /*for (let b in base) {
                if (obj[b] == undefined) {
                    if (base[b] instanceof Array) {
                        obj[b] = [];
                        for (let i = 0; i < base[b].length; i++) { obj[b].push(base[b][i]) }
                    }
                }

                else {
                    if (typeof base[b] == 'object' && base[b] != null) {
                        obj[b] = {};
                        iterate(base[b], obj[b]);
                    }

                    else { obj[b] = base[b] }
                }
            }*/

            for (let b in base) {
                if (obj[b] == undefined) { obj[b] = clone(base[b]) }
                else if (typeof obj[b] == 'object' && !(obj[b] instanceof Array)) { iterate(base[b], obj[b]) }
            }
        }

        guild = await imports.data.guild.get(message.guild.id);
        iterate(imports.config.defaults.guild, guild);
        if (!guild.members[message.author.id]) { guild.members[message.author.id] = clone(imports.config.defaults.member) }
        else { iterate(imports.config.defaults.member, guild.members[message.author.id]) }
        user = await imports.data.user.get(message.author.id);
        iterate(imports.config.defaults.user, user);
    }

    let command = imports.core.command;

    var local = {
        guild: guild,
        user: user
    }

    if (imports.data) { local.member = guild.members[message.author.id] }
    var passthrough = {};

    for (var i in imports) { passthrough[i] = imports[i] }

    // appending more information to the "passthrough" object (see shard.js for initial object contruction)
    passthrough.guild = message.guild;
    passthrough.channel = message.channel;
    passthrough.user = message.author;
    passthrough.member = message.member;
    passthrough.message = message;
    passthrough.blacklist = guild.blacklist;
    passthrough.whitelist = guild.whitelist;
    passthrough.local = local;

    if (message.content.startsWith(local.guild.prefix.toLowerCase())) {
        var content = message.content;

        var name = content.slice(local.guild.prefix.length).split(' ')[0].toLowerCase();
        var full = name + content.slice(local.guild.prefix.length + name.length);

        if (passthrough.commands.aliases.get(name)) { name = passthrough.commands.aliases.get(name) }

        var cmd = {
            object: passthrough.commands.configs.get(name) ? passthrough.commands.configs.get(name) : null,
            full: full,
            name: name,
            arguments: []
        }

        var embed = new Discord.MessageEmbed();
        embed.setColor(passthrough.local.guild.colors.accent);


        // if command even exists (object is null otherwise)
        if (cmd.object) {

            if (!cmd.object.params) { cmd.object.params = [] }

            if (cmd.full.split(' ').length - 1 > cmd.object.params.length) {
                if (cmd.object.params[cmd.object.params.length - 1].type == 'string') {
                    var text = cmd.full.split(' ').splice(cmd.object.params.length);
                    text = '"' + text.join(' ') + '"';
                    var args = cmd.full.split(' ').splice(0, cmd.object.params.length);
                    args[args.length] = text;
                    cmd.full = args.join(' ');
                }
            }

            // not sure if this is the proper way to handle quote wrapping
            let longArgs = cmd.full.match(/("([^"]|"")*")/g); // stores the long strings for later use

            cmd.full = cmd.full.replace(/("([^"]|"")*")/g, '[s]'); // replaces all the matches with an arbitrary placeholder

            // stores the current argument data (to be altered later)
            cmd.arguments = cmd.full.slice(local.guild.prefix.length + cmd.name + 1).split(' ');
            cmd.arguments.shift();
            
            // replaces all the arbirary placeholders with their respective strings directly within the arguments array
            for (let a = 0; a < cmd.arguments.length; a++) {
                if (cmd.arguments[a] == '[s]') {
                    if (longArgs[0]) {
                        cmd.arguments[a] = longArgs[0].slice(1, -1);
                        longArgs.shift();
                    }
                }
            }

            let status = await command.status(cmd, passthrough);
            if (status.userUsable) {
                if (status.botUsable) {
                    
                    /*for (let p = 0; p < cmd.object.params.length; p++) {
                        if (cmd.object.params[p].length > 0 && cmd.object.params[p][cmd.object.params[p].length - 1].type == 'string') {
                            let arr = [];
                            let shift = 0;
                            for (let a = 0; a < cmd.object.params[p].length - 1; a++) {
                                arr.push(cmd.arguments[a]);
                                //shift++;
                                cmd.arguments.shift();
                            }

                            for (let s = 0; s < shift; s++) { cmd.arguments.shift() }

                            arr.push(cmd.arguments.join(' '));
                            cmd.arguments = arr;
                        }
                    }*/

                    // removes any "falsy" items from the array (mainly empty strings)
                    cmd.arguments = cmd.arguments.filter(Boolean);

                    let check = await command.check(cmd.name, cmd.arguments, passthrough);
                    if (check != -1) {
                        
                        cmd.arguments = await command.evaluateParams(cmd.arguments, passthrough.commands.configs.get(cmd.name).params[check], passthrough);
                        if (passthrough.commands.functions.get(cmd.name)[check].constructor.name === 'AsyncFunction') { await passthrough.commands.functions.get(cmd.name)[check](passthrough, cmd.arguments) }
                        else { passthrough.commands.functions.get(cmd.name)[check](passthrough, cmd.arguments) }

                        if (cmd.object.cooldown) {
                            if (!passthrough.local.user.cooldowns[cmd.name]) { passthrough.local.user.cooldowns[cmd.name] = -1 }
                            var date = new Date();
                            var now = date.getTime();
                            passthrough.local.user.cooldowns[cmd.name] = now;
                        }
                    }

                    else {
                        if (status.visible) {
                            embed.setTitle(`invalid syntax`);
                            embed.setDescription(`usage:\n\`${command.syntax(local.guild.prefix, cmd.name, passthrough).trim()}\``);
                        }

                        else { embed.setDescription(`command not found`) }
                    }
                }
            }

            else {
                // command usage checks
                if (!status.master && status.visible) {
                    if (status.nsfw && !passthrough.channel.nsfw) { embed.setDescription(`you need to be in an nsfw channel to use that command`) }
                    else if (!status.whitelisted && passthrough.local.guild.options.errors.notWhitelisted) { embed.setDescription(`you need to be whitelisted to use that command`) }
                    else if (status.blacklisted && passthrough.local.guild.options.errors.isBlacklisted) { embed.setDescription(`you are blacklisted from using that command`) }
                    else if (status.missingPerm && passthrough.local.guild.options.errors.noUserPerms) { embed.setDescription(`you don't have permission to use that command`) }
                    else if (!status.botUsable && passthrough.local.guild.options.errors.noBotPerms) { embed.setDescription(`I don't have permission to do that`) }
                    else if (status.cooldown) {
                        var date = new Date();
                        var now = date.getTime();
                        var usedWhen = user.cooldowns[cmd.name];
                        var difference = cmd.object.cooldown - (now - usedWhen);
                        var duration = moment.duration(difference);
                        var parsed;
                        if (duration.get('minutes') == 0) { parsed = duration.format('00:ss') }
                        else if (duration.get('hours') != 0) { parsed = duration.format('hh:mm:ss') }
                        else { parsed = duration.format('mm:ss') }
                        embed.setDescription(`you can use that command again in **${parsed}**`);
                    }
                }

                else { embed.setDescription(`command not found`) }
            }
        }

        else { embed.setDescription(`command not found`) }


        if (embed.description) {
            if (embed.description == 'command not found') { if (local.guild.options.errors.unknownCommand) { message.channel.send(embed) } }
            else {
                let sent = await message.channel.send(embed);
                if (embed.description.startsWith(`you can use that command again in`) && local.guild.options.deleteCooldownedAttempts && passthrough.guild.me.hasPermission(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
                    /**if (Discord.Permissions.FLAGS[permission]) {
            if (!passthrough.member.hasPermission(Discord.Permissions.FLAGS[permission])) { toReturn.userPerms = false }
            if (!passthrough.guild.me.hasPermission(Discord.Permissions.FLAGS[permission])) { toReturn.botPerms = false }
        }

        return toReturn; */
                    sent.delete({ timeout: 5000 });
                    message.delete();
                }
            }
        }
    }

    else {
        if (passthrough.experience) {
            let exp = randBetween(90, 120);
            //let exp = randBetween(10, 25);
            let length = message.content.length;
            let letterExp = Math.floor(length / 5);
            exp += letterExp;

            await passthrough.experience.add(passthrough, exp);
        }
    }

    // database management if a data module exists
    if (passthrough.data) {
        await passthrough.data.guild.update(message.guild.id, passthrough.local.guild);
        await passthrough.data.user.update(message.author.id, passthrough.local.user);
    }
}