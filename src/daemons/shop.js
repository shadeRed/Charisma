Math.seedrandom = require('seedrandom');

module.exports = function(imports) {
    imports.shop = {
        getPrice: function(name) {
            var date = new Date();
            let item = imports.economy.items[name];
            Math.seedrandom(`${date.getDate()}${name}`);
            return Math.floor(Math.random() * (item.value * 1.5) + (item.value * 0.5));
        },
    
        isAvailable: function(name) {
            var date = new Date();
            let item = imports.economy.items[name];
            Math.seedrandom(`${date.getDate()}${name}`);
            var rarity = 3;
            if (item.tags.includes('uncommon')) { rarity = 6 }
            else if (item.tags.includes('rare')) { rarity = 12 }
            else if (item.tags.includes('elusive')) { rarity = 24 }
        
            var odds = Math.floor(Math.random() * 1000);
            if (item.tags.includes('elusive')) { rarity = 950 }
            else if (item.tags.includes('rare')) { rarity = 750 }
            else if (item.tags.includes('uncommon')) { rarity = 500 }
            else { rarity = 300 }
    
            return odds > rarity;
        },
    
        getValue: function(name) {
            var toReturn;
            let item = imports.economy.items[name];
            if (item.shoppable) { toReturn = Math.floor(this.getPrice(name) * 0.75) }
            else { toReturn = item.value }
            toReturn = Math.floor(toReturn);
            return toReturn;
        }
    }
}