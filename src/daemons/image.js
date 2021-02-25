let request = require('request');
let extensions = [ 'png', 'jpg', 'jpeg', 'gif' ];

async function getBuffer(url) {
    return new Promise(function(resolve, reject) {
        request({ url, encoding: null }, function(error, response, buffer) {
            if (error) { reject(error) }
            else { resolve(buffer) }
        });
    });
}

module.exports = function(context) {
    context.core.image = {
        gmToBuffer: function(data) {
            return new Promise(function(resolve, reject) {
                data.stream(function(err, stdout, stderr) {
                    if (err) { return reject(err) }
                    let chunks = []
                    stdout.on('data', function(chunk) { chunks.push(chunk) })
                    stdout.once('end', function() { resolve(Buffer.concat(chunks)) })
                    stderr.once('data', function(data) { reject(String(data)) })
                });
            });
        },

        getLastImage: async function(imports) {
            let messages = await imports.channel.messages.fetch({ limit: 20 });
            let arr = messages.array();
            let attachment;

            for (let a = 0; a < arr.length; a++) {
                if (arr[a].attachments.size > 0) {
                    let file = arr[a].attachments.array()[arr[a].attachments.array().length - 1];
                    let name = file.name;
                    if (extensions.includes(name.split('.')[name.split('.').length - 1].toLowerCase())) {
                        attachment = file;
                        break;
                    }
                }

                else if (arr[a].embeds.length > 0) {
                    let embed = arr[a].embeds[arr[a].embeds.length - 1];
                    if (embed.image) {
                        // pseudo attachment object
                        // probably a better way of doing this
                        attachment = {
                            url: embed.image.url,
                            name: embed.image.url.split('/')[embed.image.url.split('/').length - 1].split('?')[0]
                        }

                        break;
                    }
                }
            }

            if (attachment) {
                return {
                    attachment: attachment,
                    buffer: await getBuffer(attachment.url)
                }
            }

            else { return null }
        }
    }
}