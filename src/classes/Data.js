//let CommandContext = require('./CommandContext.js');
let defaults = require('./../config/defaults.json');

class Data {
    constructor() {
        this.start = async function() {}
        
        /**
         * 
         * @param {string} table 
         * @param {string} id 
         */
        this._get = async function(table, id) { return new Object() }

        /**
         * 
         * @param {string} table 
         * @param {string} id 
         * @param {object} data 
         * @param {object} before 
         */
        this._update = async function(table, id, data, before) {}

        this.guild = {
            /**
             * 
             * @param {string} id 
             */
            get: async function(id) { return defaults.guild },

            /**
             * 
             * @param {string} id 
             * @param {object} data 
             */
            update: async function(id, data) {}
        }

        this.user = {
            
            /**
             *
             * @param {string} id 
             */
            get: async function(id) { return defaults.user },

            /**
             * 
             * @param {string} id 
             * @param {object} data 
             */
            update: async function(id, data) {},

        }

        this.experience = {

            /**
             * 
             * @param {string} id 
             */
            get: async function(id) { return defaults.experience },

            /**
             * 
             * @param {string} id 
             * @param {object} data 
             */
            update: async function(id, data) {}
        },

        this.karma = {

            /**
             * 
             * @param {string} id 
             */
            get: async function(id) { return defaults.karma },

            /**
             * 
             * @param {string} id 
             * @param {object} data 
             */
            update: async function(id, data) {}
        }

        this.inventory = {

            /**
             * 
             * @param {string} id 
             */
            get: async function(id) { return defaults.inventory },

            item: {

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 */
                get: async function(id, item) {},

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 */
                has: async function(id, item) { return true },

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 * @param {object} meta 
                 */
                add: async function(id, item, meta) {},

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 * @param {number} index 
                 */
                remove: async function(id, item, index) {},

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 * @param {number} index 
                 * @param {object} meta 
                 */
                setMeta: async function(id, item, index, meta) {}
            },

            key: {
                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 */
                get: async function(id, item) { return null },

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 * @param {object} meta 
                 */
                set: async function(id, item, meta) {},

                /**
                 * 
                 * @param {string} id 
                 * @param {string} item 
                 */
                remove: async function(id, item) {}
            },

            money: {
                /**
                 * 
                 * @param {string} id 
                 */
                get: async function(id) { return 0 },

                /**
                 * 
                 * @param {string} id 
                 * @param {number} money 
                 */
                add: async function(id, money) {},

                /**
                 * 
                 * @param {string} id 
                 * @param {number} money 
                 */
                remove: async function(id, money) {}
            }
        }
    }
}

module.exports = Data;