/*
levelToExp: function(level, factor) {
        var exp = 0;
        for (var l = 0; l < level; l++) {
            exp += Math.floor(200 * Math.pow(l + 1, factor));
        }

        return exp;
    },
*/

/*
expToLevel: function(exp, factor) {
        var level = 0;
        var required = Math.floor(500 * Math.pow(1, factor));
        while (exp > required) {
            exp -= required;
            level += 1;
            required = Math.floor(500 * Math.pow(level + 1, factor));
        }

        return level;
},*/

/*getRelative: function(exp, factor) {
        var level = this.expToLevel(exp, factor);
        var currentExp = this.levelToExp(level, factor);
        var nextExp = this.levelToExp(level + 1, factor);
        var relativeExp = exp - currentExp;
        var relativeMax = nextExp - currentExp;

return [relativeExp, relativeMax];*/

function levelToExp(level, factor) {
    var exp = 0;
    for (var l = 0; l < level; l++) { exp += Math.floor(500 * Math.pow(l + 1, factor)) }
    return exp;
}

function expToLevel(exp, factor) {
    var level = 0;
    var required = Math.floor(500 * Math.pow(1, factor));
    while (exp > required) {
        exp -= required;
        level += 1;
        required = Math.floor(500 * Math.pow(level + 1, factor));
    }

    return level;
}

function getRelative(exp, factor) {
    var level = expToLevel(exp, factor);
    var currentExp = levelToExp(level, factor);
    var nextExp = levelToExp(level + 1, factor);
    var relativeExp = exp - currentExp;
    var relativeMax = nextExp - currentExp;
    return [relativeExp, relativeMax];
}

var chartData = new Object();
var chartObject;

function generateData(curve) {
    chartData.levels = new Array();
    chartData.values = new Array();
    for (var l = 0; l <= 50; l++) {
        chartData.levels.push(l);
        chartData.values.push(getRelative(levelToExp(l, curve), curve)[0]);
    }
}

function expChart() {
    var canvas = document.getElementById('expChart');
    generateData(2.2);
    Chart.defaults.global.legend.display = false;

    chartObject = new Chart(canvas, {
        type: 'line',
        data: {
            labels: chartData.levels,
            datasets: [{
                label: 'exp',
                data: chartData.values,
                backgroundColor: 'rgba(60,63,98, 0.4)',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'experience'
                    }
                }],

                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'level'
                    }
                }]
            }
        }
    });
}

function regenerateExpChart() {
    var curveElementValue = document.getElementById('customExpCurve').value;
    var curve = 2.2;
    if (curveElementValue != "") { curve = parseFloat(curveElementValue) }
    generateData(curve);
    chartObject.data.labels = chartData.levels;
    chartObject.data.datasets[0].data = chartData.values;
    chartObject.update();
}