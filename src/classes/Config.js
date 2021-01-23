let colors = require('./../config/colors.json');
let data = require('./../config/data.json');
let defaults = require('./../config/defaults.json');
let main = require('./../config/main.json');
let options = require('./../config/options.json');

class Config {
    constructor() {
        this.colors = colors;
        this.data = data;
        this.defaults = defaults;
        this.main = main;
        this.options = options;
    }
}

module.exports = Config;