let rethink = require('rethinkdb');

let transform = require('lodash.transform')
let isEqual = require('lodash.isequal')
let isArray = require('lodash.isarray')
let isObject = require('lodash.isobject');

var config;
var connection;
let database;
var name = 'charisma';
var defaults;

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

/**
     * Find difference between two objects
     * @param  {object} origObj - Source object to compare newObj against
     * @param  {object} newObj  - New object with potential changes
     * @return {object} differences
     */
    function diff(origObj, newObj) {
        function changes(newObj, origObj) {
            let arrayIndexCounter = 0;
            return transform(newObj, function (result, value, key) {
                if (!isEqual(value, origObj[key])) {
                    let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
                    result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value;
                }
            });
        }

        return changes(newObj, origObj);
      }

/*function diff(obj1, obj2) {
    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') { return obj1 }

    var diffs = {};
    var key;

    function arraysMatch(arr1, arr2) {
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) { if (arr1[i] !== arr2[i]) { return false } }
        // Otherwise, return true
        return true;

    };

    function compare(item1, item2, key) {
        // Get the object type
        var type1 = Object.prototype.toString.call(item1);
        var type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            var objDiff = diff(item1, item2);
            if (Object.keys(objDiff).length > 1) { diffs[key] = objDiff }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) { diffs[key] = item2 }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') { if (item1.toString() !== item2.toString()) { diffs[key] = item2 } }
        else { if (item1 !== item2 ) { diffs[key] = item2 } }
    }

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key] ) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;
}*/

module.exports = async function(imports) {
    delete imports.config.defaults.guild.prefix;
    delete imports.config.defaults.guild.colors.accent;

    config = { host: imports.config.data.host, port: imports.config.data.port, variation: imports.config.main.variation }
    imports.data = {
        start: async function() {
            connection = await rethink.connect({ host: config.host, port: config.port });
            var databases = await rethink.dbList().run(connection);
            if (!databases.includes(name)) { await rethink.dbCreate(name).run(connection) }
            var tables = await rethink.db(name).tableList().run(connection);

            let arr = ['guild', 'user', 'inventory', 'karma', 'experience', config.variation];
            for (let a = 0; a < arr.length; a++) { if (!tables.includes(arr[a])) { await rethink.db(name).tableCreate(arr[a]).run(connection) } }

            console.ready(`connected to rethink://${config.host}:${config.port}`);
            connection.addListener('close', function() {
                console.error('lost connection...');
                process.emit('SIGINT');
            });
        },

        _get: async function(table, id) {
            let obj = await rethink.db(name).table(table).get(id).run(connection);
            if (obj == null) {
                obj = clone(imports.config.defaults[table]);
                obj.id = id;
                await rethink.db(name).table(table).get(id).replace(obj).run(connection);
            }

            delete obj.id;

            return obj;
        },

        _update: async function(table, id, data) {
            data.id = id;
            await rethink.db(name).table(table).get(id).replace(data).run(connection)
        },

        karma: {
            get: async function(id) {
                let karma = await imports.data._get('karma', id);
                return karma;
            },

            update: async function(id, obj) { await imports.data._update('karma', id, obj) }
        },

        guild: {
            get: async function(id) {
                let guild = await imports.data._get('guild', id);
                let variation = await imports.data._get(config.variation, id);
                guild.prefix = variation.prefix;
                guild.colors.accent = variation.accent;

                return guild;
            },

            update: async function(id, guild) {
                //let guild = await this.get(id);
                let variation = {
                    prefix: guild.prefix,
                    accent: guild.colors.accent
                }

                delete guild.prefix;
                delete guild.colors.accent;

                await imports.data._update('guild', id, guild);
                await imports.data._update(config.variation, id, variation);
            },
        },

        user: {
            get: async function(id) {
                let user = await imports.data._get('user', id);
                return user;
            },

            update: async function(id, data) { await imports.data._update('user', id, data) }
        },

        experience: {
            get: async function(id) {
                let exp = await imports.data._get('experience', id);
                return exp;
            },

            update: async function(id, data) { await imports.data._update('experience', id, data) }
        },

        inventory: {
            get: async function(id) {
                let inventory = await imports.data._get('inventory', id);
                return inventory;
            },

            update: async function(id, data) { await imports.data._update('inventory', id, data) }
        }
    }
}