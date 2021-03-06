let fs = require('fs');
let emoji = require('discord-emoji-converter');

let items = {};
let tables = {};

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
}

function recur(path) {
    let files = fs.readdirSync(`${__dirname}/../economy/${path}`);
    for (let f = 0; f < files.length; f++) {
        let isFolder = fs.statSync(`${__dirname}/../economy/${path}/${files[f]}`).isDirectory();
        if (isFolder) { recur(`${path}/${files[f]}`) }
        else {
            let item = require(`./../economy/${path}/${files[f]}`);
            items[files[f].split('.json')[0]] = item;
        }
    }
}

module.exports = async function(imports) {
    recur(`items`);

    let tableFiles = fs.readdirSync(`${__dirname}/../economy/tables/`);
    for (let f = 0; f < tableFiles.length; f++) {
        let table = require(`./../economy/tables/${tableFiles[f]}`);
        tables[tableFiles[f].split('.js')[0]] = table;
    }

    imports.economy = {
        items: items,
        tables: tables
    }

    imports.itemFromEmoji = function(emote) {
        let toReturn = null;
        for (let i in imports.items) { if (imports.items[i].emoji == emoji.getShortcode(emote).split(' ').join('')) { toReturn = i } }
        return toReturn;
    }

    /**get: async function(id, item) {
                    let inventory = await imports.data.inventory.get(id);
                    let toReturn = null;
                    for (let i in inventory.items) { if (i == item) { toReturn = inventory.items[i] } }
                    return toReturn;
                },

                async function(id, item) { return await this.get(id, item) != null },

                

                 */
    
    imports.inventory = function(id) {
        let self = this;
        self.id = id;

        self.init = async function() {
            self.data = await imports.data._get('inventory', id);
            for (let i in self.data.items) { if (self.data.items[i] <= 0) { delete self.data.items[i] } }
            self.before = clone(self.data);
        }

        self.refresh = async function() { await self.init() }

        self.items = {
            get: function(item) { return self.data.items[item] != undefined ? self.data.items[item] : null },
            getAll: function() { return self.data.items },
            has: function(item) { return self.items.get(item) != null && self.items.get(item) != 0 },

            add: function(item, qty) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (items[item].tags.includes('key')) { throw new Error(`item "${item}" is a key item`) }

                if (!self.data.items[item]) { self.data.items[item] = qty }
                else { self.data.items[item] += qty }

                if (!self.data.obtained[item]) { self.data.obtained[item] = qty }
                else { self.data.obtained[item] += qty }
            },

            remove: function(item, qty) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (items[item].tags.includes('key')) { throw new Error(`item "${item}" is a key item`) }
                if (!self.data.items[item]) { throw new Error(`that user doesn't have item "${item}"`) }
                if (qty > self.data.items[item]) { throw new Error(`that user doesn't have that many of "${item}"`) }

                self.data.items[item] -= qty;

                if (self.data.items[item] <= 0) { delete self.data.items[item] }
            },

            removeAll: function(item) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (items[item].tags.includes('key') || items[item].tags.includes('container')) { throw new Error(`item "${item}" is not a normal item`) }
                if (self.data.items[item] == undefined) { throw new Error(`that user does not have item "${item}"`) }
                delete self.data.items[item];
            },

            obtained: function(item) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (items[item].tags.includes('key')) { throw new Error(`item "${item}" is a key item`) }
                return self.data.obtained[item] != undefined ? self.data.obtained[item] : 0;
            }
        }


        self.obtainedText = function(str, force) {
            function parse(s, i) {
                let chars = s.split('');
                for (let c = 0; c < chars.length; c++) {
                    if (chars[c] == ':') {
                        let emojiText = '';
                        let p = c+1;
                        while (chars[p] != ':' && p < chars.length) {
                            emojiText += chars[p];
                            p++;
                        }
                
                        emojiText = `:${emojiText}:`;
                        
                        let skip = false;
        
                        if (emojiText != items[i].emoji) { skip = true }
        
                        if (chars[p+1] == 'x' && !isNaN(chars[p+2])) {
                            p += 2;
                            let qty = '';
                            while (!isNaN(chars[p]) && chars[p] != ' ' && p < chars.length) {
                                qty += chars[p];
                                p++;
                            }
                
                            emojiText += `x${qty}`;
                        }
                
                        c = p;
                
                        if (skip) { c += emojiText.length }
                        else { s = s.replace(emojiText, `${emojiText} (${i})`) }
                    }
                }
        
                return s;
            }
        
            // if first item obtained or item is a key item
            for (let i in items) { if (str.includes(items[i].emoji) && ((items[i].tags.includes('key') || items[i].tags.includes('container')) || self.items.obtained(i) == 1 || force)) { str = parse(str, i) } }
        
            return str;
        }

        self.keys = {
            get: function(item) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('key')) { throw new Error(`item "${item}" is not a key item`) }
                return self.data.key[item] != undefined ? self.data.key[item] : null;
            },

            getAll: function() { return self.data.key },
            has: function(item) { return self.keys.get(item) != null },

            add: function(item) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('key')) { throw new Error(`item "${item}" is not a key item`) }
                if (self.data.key[item] != undefined) { throw new Error(`that user already has key item "${item}"`) }
                self.data.key[item] = {};
            },

            set: function(item, obj) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('key')) { throw new Error(`item "${item}" is not a key item`) }
                if (self.data.key[item] == undefined) { throw new Error(`that user does not have key item "${item}"`) }

                self.data.key[item] = obj;
            }
        }

        self.containers = {
            get: function(item) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('container')) { throw new Error(`item "${item}" is not a container`) }

                return self.data.containers[item] != undefined ? self.data.containers[item] : [];
            },

            getAll: function() { return self.data.containers },
            has: function(item) { return self.containers.get(item).length > 0 },

            add: function(item, obj) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('container')) { throw new Error(`item "${item}" is not a container`) }
                if (self.data.containers[item] == undefined) { self.data.containers[item] = [obj] }
                else { self.data.containers[item].push(obj) }
            },

            remove: function(item, index) {
                if (!items[item]) { throw new Error(`item "${item}" does not exist`) }
                if (!items[item].tags.includes('container')) { throw new Error(`item "${item}" is not a container`) }
                if (self.data.containers[item] == undefined) { throw new Error(`that user does not have any "${item}" containers`) }
                if (self.data.containers[item][index] == undefined) { throw new Error(`that user does not have a "${item}" container at index ${index}`) }

                self.data.containers[item].splice(index, 1);
                if (self.data.containers[item].length == 0) { delete self.data.containers[item] }
            }
        }

        self.money = {
            get: function() { return self.data.balance },
            add: function(money) { self.data.balance += money },
            remove: function(money) {
                if ((self.data.balance - money) < 0) { throw new Error(`the user can't have a negative balance`) }
                self.data.balance -= money;
            }
        }

        self.append = async function() { await imports.data._update('inventory', self.id, self.data) }
    }

    imports.inventory.addMoney = async function(context, id, money) {
        let user = await context.data._get('inventory', id);
        let cloned = clone(user);
        user.balance += money;
        await context.data._update('inventory', id, user, cloned);
    }

    imports.inventory.removeMoney = async function(context, id, money) {
        let user = await context.data._get('inventory', id);
        let cloned = clone(user);
        if ((user.balance - money) < 0) { throw new Error(`the user can't have a negative balance`) }
        user.balance -= money;
        await context.data._update('inventory', id, user, cloned);
    }

    /*imports.farm = function(id) {
        let self = this;
        self.id = id;

        self.init = async function() {
            self.data = await imports.data._get('farm', id);
            self.orchardPlots = self.data.orchardPlots;
            self.before = clone(self.data);

            if (!(self.data.orchard instanceof Array)) { self.data.orchard = [] }
        }

        self.refresh = async function() { await self.init() }

        self.orchard = {
            //get: function(fruit) {
            //    let result = [];
            //    for (let o in self.data.orchard) { if (o == fruit) { result = self.data.orchard[fruit] } }
            //    return result;
            //},

            get: function() { return self.data.orchard },

            getPlots: function() {
                let count = self.orchardPlots;
                let trees = self.data.orchard;
                //for (let o in self.data.orchard) { for (let t = 0; t < self.data.orchard[o].length; t++) { trees.push({ name: o, data: self.data.orchard[o][t] }) } }

                let plots = [];
                for (let p = 0; p < count; p++) {
                    let plot = [];
                    for (let r = 0; r < 3; r++) {
                        let row = [];
                        for (let c = 0; c < 3; c++) { row.push(trees[(p*9)+(r*3)+c] ? trees[(p*9)+(r*3)+c] : null) }
                        plot.push(row);
                    }

                    plots.push(plot);
                }

                return plots;
            },

            getPlotsGrid: function(p) {
                let blank = '<:nothing:757073100134416455>';

                let rows = [];

                let plots = self.orchard.getPlots();
                for (let r in plots[p]) {
                    let row = '';
                    for (let c = 0; c < plots[p][r].length; c++) {
                        row += plots[p][r][c] != null ? items[plots[p][r][c].fruit].emoji : blank;
                    }

                    rows.push(row);
                }

                return rows.join('\n');
            },

            //has: function(fruit) { return self.orchard.get(fruit) != null },

            plant: function(fruit, meta) {
                if (!items[fruit].trees) { throw new Error(`item "${fruit}" is not a treeable`) }
                if ((Math.random() * 100) < items[fruit].trees.fail) { return false }

                let obj = {
                    fruit: fruit,
                    planted: Date.now(),
                    harvested: -1,
                    meta: meta
                }

                self.data.orchard.push(obj);

                //if (!self.data.orchard[fruit]) { self.data.orchard[fruit] = [] }
                //self.data.orchard[fruit].push(obj);

                return true;
            },

            harvest: function(i) {
                let meta = null;
                let tree = self.data.orchard[i];

                if (tree) {
                    let fruit = tree.fruit;
                    let item = items[fruit].trees;

                    if (Date.now() > (tree.planted + item.growth)) {
                        if (tree.harvested == -1 || Date.now() > (tree.harvested + item.harvest)) {
                            meta = { fruit: tree.fruit, yield: 0, died: false }
                            meta.yield = Math.floor(Math.random() * item.yield[1]) + item.yield[0];
                            if ((Math.random() * 100) < item.death) { meta.died = true }
                            self.data.orchard[i].harvested = Date.now();
                        }
                    }

                    if (meta != null && meta.died) { console.log(meta.died); self.data.orchard = self.data.orchard.splice(i, 1) }
                }

                return meta;
            },

            harvestPlot: function(p) {
                let results = [];
                for (let i = 0; i < 9; i++) { if (self.data.orchard[(p*9)+i]) { results.push(self.orchard.harvest((p*9)+i)) } }
                return results;
            }
        }

        self.append = async function() { await imports.data._update('farm', self.id, self.data, self.before) }
    }*/
}