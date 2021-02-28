let Discord = require('discord.js');

function inventoryHelper(context) {
    let self = this;
    self.context = context;
    self.inventory = new self.context.inventory(self.context.user.id);

    self.init = async function() { await self.inventory.init() }

    self.items = function() { return self.inventory.items.getAll() }
    self.keys = function() { return self.inventory.keys.getAll() }
    self.containers = function() { return self.inventory.containers.getAll() }

    self.itemsText = function() {
        let items = self.items();
        let arr = [];
        for (let i in items) { arr.push(`${self.context.economy.items[i].emoji}x${items[i]}`) }

        return arr.length > 0 ? arr.join(' ') : '[nothing]'
    }

    self.keysText = function() {
        let keys = self.keys();
        let arr = [];
        for (let k in keys) { arr.push(self.context.economy.items[k].emoji) }

        return arr.length > 0 ? arr.join(' ') : '[nothing]'
    }

    self.containersText = function() {
        let containers = self.containers();
        let arr = [];
        for (let c in containers) { arr.push(`${self.context.economy.items[c].emoji}x${containers[c].length}`) }

        return arr.length > 0 ? arr.join(' ') : '[nothing]'
    }

    self.itemsTextE = function() { return self.inventory.obtainedText(self.itemsText(), true) }
    self.keysTextE = function() { return self.inventory.obtainedText(self.keysText(), true) }
    self.containersTextE = function() { return self.inventory.obtainedText(self.containersText(), true) }
}

module.exports = {
    config: {
        permissions: [],
        description: 'inventory',
        hidden: false,
        nsfw: false,
        tags: ['economy'],
        aliases: ['inv'],
        params: [
            [],
            [ { required: true, type: 'string', value: 'expanded' } ],
            [ { required: true, type: 'string', value: 'export' } ]
        ]
    },

    command: [
        async function(context) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
    
            let helper = new inventoryHelper(context);
            await helper.init();

            embed.addField('items', helper.itemsText());
            embed.addField('key items', helper.keysText());

            if (helper.containers().length > 0) { embed.addField('containers', helper.containersText()) }
    
            context.channel.send(embed);
        },

        // expanded
        async function(context) {
            let embed = new Discord.MessageEmbed();
            embed.setColor(context.local.guild.colors.accent);
    
            let helper = new inventoryHelper(context);
            await helper.init();

            embed.addField('items', helper.itemsTextE());
            embed.addField('key items', helper.keysTextE());

            if (helper.containers().length > 0) { embed.addField('containers', helper.containersTextE()) }
    
            context.channel.send(embed);
        },

        // export
        async function(context) {
            let inventory = new context.inventory(context.user.id);
            await inventory.init();

            let json = JSON.stringify(inventory.data);

            let attachment = new Discord.MessageAttachment(Buffer.from(json, 'utf8'), 'export.json');

            context.channel.send(attachment);
        }
    ]
}