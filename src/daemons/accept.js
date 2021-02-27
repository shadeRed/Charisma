let Discord = require('discord.js');

function clearEmpties(o) {
    for (var k in o) {
        if (!o[k] || typeof o[k] !== "object") { continue }
        clearEmpties(o[k]);
        if (Object.keys(o[k]).length === 0) { delete o[k] }
    }
}

/**
 * 
 * @param {BotContext} imports 
 */
module.exports = async function(imports) {
    imports.requests = new Map();

    // -1: active request already exists
    // 0: request expired
    // 1: request accepted

    imports.awaitRequest = function(guild, channel, user, password) {
        return new Promise(function(resolve, reject) {

            if (!imports.requests.get(guild)) { imports.requests.set(guild, new Map()) }
            if (!imports.requests.get(guild).get(channel)) { imports.requests.get(guild).set(channel, new Map()) }
            if (imports.requests.get(guild).get(channel).get(user) == undefined) { imports.requests.get(guild).get(channel).set(user, password ? password : false) }
            else { resolve(-1) }

            let count = 0;
            let interval = setInterval(function() {
                count += 1;
                if (imports.requests.get(guild).get(channel).get(user) == true) {
                    imports.requests.get(guild).get(channel).delete(user);
                    if (imports.requests.get(guild).get(channel).size == 0) { imports.requests.get(guild).delete(channel) }
                    if (imports.requests.get(guild).size == 0) { imports.requests.delete(guild) }
                    resolve(1);
                }

                else if (count == 300) {
                    imports.requests.get(guild).get(channel).delete(user);
                    if (imports.requests.get(guild).get(channel).size == 0) { imports.requests.get(guild).delete(channel) }
                    if (imports.requests.get(guild).size == 0) { imports.requests.delete(guild) }
                    clearInterval(interval);
                    resolve(0);
                }
            }, 100);
        });
    }

    imports.request = function(context, embed, callback, hasCode) {
        let guild = context.guild.id;
        let channel = context.channel.id;
        let user = context.user.id;

        if (!imports.requests.get(guild)) { imports.requests.set(guild, new Map()) }
        if (!imports.requests.get(guild).get(channel)) { imports.requests.get(guild).set(channel, new Map()) }
        if (imports.requests.get(guild).get(channel).get(user) == undefined) {
            if (hasCode) {
                let code = [];
                for (let i = 0; i < 4; i++) { code.push(Math.floor(Math.random() * 9)) }
                imports.requests.get(guild).get(channel).set(user, code.join(''));
                embed.setFooter(`do ${context.local.guild.prefix}accept ${code.join('')} to confirm`);
            }

            else {
                imports.requests.get(guild).get(channel).set(user, false);
                embed.setFooter(`do ${context.local.guild.prefix}accept to confirm`);
            }

            context.channel.send(embed).then(function(sent) {
                let count = 0;
                let interval = setInterval(function() {
                    count += 1;
                    if (imports.requests.get(guild)?.get(channel)?.get(user) == true) {
                        imports.requests.get(guild)?.get(channel)?.delete(user);
                        if (imports.requests.get(guild)?.get(channel)?.size == 0) { imports.requests.get(guild)?.delete(channel) }
                        if (imports.requests.get(guild)?.size == 0) { imports.requests.delete(guild) }
                        clearInterval(interval);
                        callback(sent);
                    }

                    else if (count == 300) {
                        imports.requests.get(guild).get(channel).delete(user);
                        if (imports.requests.get(guild).get(channel).size == 0) { imports.requests.get(guild).delete(channel) }
                        if (imports.requests.get(guild).size == 0) { imports.requests.delete(guild) }

                        let timeout = new Discord.MessageEmbed();
                        timeout.setColor(context.local.guild.colors.accent);
                        timeout.setDescription(`the request has timed out!`);
                        sent.edit(timeout);
                    }
                }, 100);
            });
        }

        else {
            embed.setDescription(`you already have a pending request!`);
            context.channel.send(embed);
        }
    }
}