let fs = require('fs');
let flavors = {};
let accentbank = require('./../flavors/accentbank.json');

function recur(path, obj) {
    let files = fs.readdirSync(`${__dirname}/../flavors${path}`);
    for (let f = 0; f < files.length; f++) {
        let isFolder = fs.statSync(`${__dirname}/../flavors${path}/${files[f]}`).isDirectory();
        if (isFolder) { obj[files[f]] = {}; recur(`${path}/${files[f]}`, obj[files[f]]); }
        else {  obj[files[f].split('.js')[0]] = require(`./../flavors${path}/${files[f]}`) }
    }
}

module.exports = function(imports) {
    recur(`/`, flavors);
    imports.flavors = {
        get: function(flavor) { if (flavors[flavor]) { return flavors[flavor] } },
        getAll: function() { return flavors },
        pick: function(flavor, main, sub) {
            let accents = accentbank[flavor];

            let flavorText = flavors[flavor];
            let textArray = flavorText[main][sub];

            let rand = textArray[Math.floor(Math.random() * textArray.length)];
            for (i in rand.split('')) {
                if (rand[i] == '{') {
                    var accent = '';
                    var running = true;
                    var t = i;
    
                    while(running) {
                        t++;
                        if (rand.split('')[t] == '}') {
                            running = false;
                        }
    
                        else {
                            accent += rand.split('')[t];
                        }
                    }
    
                    var randAccent = accents[accent][Math.floor(Math.random() * accents[accent].length)];
                    rand = rand.replace(`{${accent}}`, randAccent);
                }
            }
    
            return rand;
        },

        variables: function(inputString, objectArray) {
            var variableArray = new Array();
            for (i in inputString.split('')) {
                if (inputString.split('')[i] == '[') {
                    var variable = '';
                    var running = true;
                    var t = i;
    
                    while(running) {
                        t++;
                        if (inputString.split('')[t] == ']') {
                            running = false;
                        }
    
                        else {
                            variable += inputString.split('')[t];
                        }
                    }
    
                    variableArray.push(variable);
                }
            }
    
            for (a in objectArray) {
                for (v in variableArray) {
                    if (objectArray[a].name == variableArray[v]) {
                        inputString = inputString.replace('[' + variableArray[v] + ']', objectArray[a].value);
                    }
                }
            }
    
            return inputString;
        }
    }
}