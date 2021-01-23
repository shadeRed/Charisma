class Flavors {
    constructor() {
        /**
         * 
         * @param {string} flavor 
         */
        this.get = function(flavor) { return null }
        
        this.getAll = function() { return null }

        /**
         * 
         * @param {string} flavor 
         * @param {string} main 
         * @param {string} sub 
         */
        this.pick = function(flavor, main, sub) { return '' }

        /**
         * 
         * @param {string} inputString 
         * @param {object[]} objectArray 
         */
        this.variables = function(inputString, objectArray) { return '' }
    }
}

module.exports = Flavors;