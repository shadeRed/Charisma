var https = require('https');
var base = 'https://api.tenor.com/v1';

async function get(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(response) {
            var data = '';
            response.on('data', function(chunk) { data += chunk });
            response.on('end', function() { resolve(JSON.parse(data)) });
            response.on('error', function(error) { reject(error) })
        });
    });
}

module.exports = function(imports) {
    key = imports.config.main.tenor;
    imports.tenor = {
        randomGif: async function(terms) {
            var retrieved = await get(`${base}/random?key=${key}&limit=1&q=${terms.split(' ').join('-')}`);
            return retrieved.results[0].media[0].gif.url;
        }
    }
}