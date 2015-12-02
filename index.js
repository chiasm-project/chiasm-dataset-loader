//chiasm-dsv-dataset.js
//
//A Chiasm plugin that loads data files.

var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var d3 = require("d3");
var dsvDataset = require("dsv-dataset");

function ChiasmDsvDataset (){

  var my = ChiasmComponent({
    path: Model.None
  });

  my.when("path", function (path){
    if(path !== Model.None){
      d3.json(path + ".json", function(error, metadata) {
        if(error){ throw error; }
        my.metadata = metadata;
      });
      d3.xhr(path + ".csv", function (error, xhr){
        if(error){ throw error; }
        my.dsvString = xhr.response;
      });
    }
  });

  my.when(["dsvString", "metadata"], function (dsvString, metadata){
    my.dataset = dsvDataset.parse({
      dsvString: dsvString, 
      metadata: metadata
    });
  });

  return my;
}

module.exports = ChiasmDsvDataset;
