//chiasm-csv-loader.js
//v__VERSION__
//
//A Chiasm plugin that loads CSV files.

var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var d3 = require("d3");

function ChiasmCSVLoader (){

  var my = ChiasmComponent({
    path: Model.None
  });

  my.when("path", function (path){
    if(path !== Model.None){

      d3.json(path + ".json", function(error, schema) {

        var numericColumns = schema.columns.filter(function (column){
          return column.type === "number";
        });

        var type = function (d){
          numericColumns.forEach(function (column){
            d[column.name] = +d[column.name];
          });
          return d;
        }

        d3.csv(path + ".csv", type, function(error, data) {
          my.data = data;
        });
      });
    }
  });

  return my;
}

module.exports = ChiasmCSVLoader;
