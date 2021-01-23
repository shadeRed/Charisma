//let CommandContext = require('./CommandContext.js');

class Inventory {
    constructor(id) {
        this.id = '';

        this.init = async function() {}

        this.refresh = async function() {}

        /**
         * 
         * @param {CommandContext} context 
         * @param {string} id 
         * @param {number} money 
         */
        this.addMoney = async function(context, id, money) {}

        /**
         * 
         * @param {CommandContext} context 
         * @param {string} id 
         * @param {number} money 
         */
        this.removeMoney = async function(context, id, money) {}

        this.items = {
            /**
             * 
             * @param {string} item 
             */
            get: function(item) { return null },

            getAll: function() { return [null] },

            /**
             * 
             * @param {string} item 
             */
            has: function(item) { return true },

            /**
             * 
             * @param {string} item 
             * @param {object} meta 
             */
            add: function(item, meta) {},

            /**
             * 
             * @param {string} item 
             * @param {number} index 
             */
            remove: function(item, index) {},

            /**
             * 
             * @param {string} item 
             */
            removeAll: function(item) {},

            /**
             * 
             * @param {string} item 
             * @param {number} index 
             * @param {object} meta 
             */
            meta: function(item, index, meta) {},
            
            /**
             * 
             * @param {string} item 
             */
            obtained: function(item) { return 0 }
        }

        self.keys = {
            /**
             * 
             * @param {string} item 
             */
            get: function(item) { return null },

            getAll: function() { return null },

            /**
             * 
             * @param {string} item 
             */
            has: function(item) { return true },

            /**
             * 
             * @param {string} item 
             * @param {number} index 
             */
            set: function(item, index) {},

            /**
             * 
             * @param {string} item 
             */
            remove: function(item) {}
        }

        self.money = {
            get: function() { return 0 },

            /**
             * 
             * @param {number} money 
             */
            add: function(money) {},

            /**
             * 
             * @param {number} money 
             */
            remove: function(money) {}
        }

        /**
         * 
         * @param {string} str 
         */
        this.obtainedText = function(str) { return '' }
    }
}

module.exports = Inventory;