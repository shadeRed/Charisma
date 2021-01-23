let CommandContext = require('./../classes/CommandContext.js');
let parseMessage = require('./../parseMessage.js');

/**
 * 
 * @param {CommandContext} imports 
 */
module.exports = function(imports) {
    imports.client.on('guildCreate', function(guild) { guild.leave(); console.log(`guild left: ${guild.name}`) });
}