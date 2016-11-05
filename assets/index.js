require("./styles/main.css");
var print = require("./print");

(function(){
    var bubbleChartSelector = '.bubbleChart';
    var pieChartSelector = '.pieChart';
    var entitySelector = 'entity';
    var numOfAuthorsSelector = 'n-authors';
    var numRevisionsSelector = 'n-revs';

    function setData(data){
        return function getData() {
            return data;
        };
    }

    function initialise(callback){
        d3.csv("../data/org-metrics.csv", function (data){
            var getData = setData(data);
            console.log("Loaded data: ");
            console.log(data);
            callback(getData);
        });
    }
    
    function generateVisuals(getData) {
        print.bubbleChart(bubbleChartSelector, getData, numRevisionsSelector);
        print.pieChart(pieChartSelector, getData, numRevisionsSelector);

        //print.printStraightLineCircles(canvasSelector, getData, numRevisionsSelector);
        print.printBarChart('.bars', getData, numRevisionsSelector);
    }

    function getString(d) {
        return d[entitySelector]
            + ',' 
            + d[numOfAuthorsSelector] 
            + ',' 
            + d[numRevisionsSelector];
    }

    initialise(generateVisuals);
})();