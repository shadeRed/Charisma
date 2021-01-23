class Shop {
    constructor() {
        /**
         * 
         * @param {string} name 
         */
        this.getPrice = function(name) { return 0 }

        /**
         * 
         * @param {string} name 
         */
        this.isAvailable = function(name) { return true }

        /**
         * 
         * @param {string} name 
         */
        this.getValue = function(name) { return 0 }
    }
}

module.exports = Shop;