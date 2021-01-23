class Farm {
    constructor(id) {
        this.id = '';
        this.init = async function() {}

        this.refresh = async function() {}

        this.orchard = {
            get: function() { return null },

            getPlots: function() { return null },

            /**
             * 
             * @param {number} p 
             */
            getPlotsGrid: function(p) { return null },

            /**
             * 
             * @param {string} fruit 
             * @param {object} meta 
             */
            plant: function(fruit, meta) {},

            /**
             * 
             * @param {number} i 
             */
            harvest: function(i) {},

            /**
             * 
             * @param {number} p 
             */
            harvestPlot: function(p) {}
        }

        this.append = async function() {}
    }
}

module.exports = Farm;