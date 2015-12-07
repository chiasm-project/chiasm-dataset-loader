var assert = require("assert"),
    Chiasm = require("chiasm"),
    ChiasmDatasetLoader = require("./index");

// Use this shim so d3.csv and d3.json work.
global.XMLHttpRequest = require("xhr2");

describe("chiasm-dsv-dataset", function () {

  it("Should parse sample CSV data.", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.datasetLoader = ChiasmDatasetLoader;
    
    // Load the Iris dataset.
    // See http://bl.ocks.org/curran/a08a1080b88344b0c8a7
    chiasm.setConfig({
      loader: {
        plugin: "datasetLoader",
        state: {
          path: "http://bl.ocks.org/curran/raw/a08a1080b88344b0c8a7/iris"
        }
      }
    });

    chiasm.getComponent("loader").then(function (loader){
      loader.when("dataset", function (dataset){

        assert.equal(dataset.data.length, 150);
        assert.equal(dataset.metadata.columns.length, 5);

        var row = dataset.data[0];
        assert.equal(typeof row.sepal_length, "number");
        assert.equal(typeof row.sepal_width,  "number");
        assert.equal(typeof row.petal_length, "number");
        assert.equal(typeof row.petal_width,  "number");
        assert.equal(typeof row.species,      "string");
        done();
      });
    });
  });
});
