let parseMessage = require('./../parseMessage.js');

module.exports = function(imports) {
    imports.messageListener = function() {
        imports.client.on('message', function(message) {
            try { parseMessage(imports, message) }
            catch(error) { console.error(error) }
        });
    }
}