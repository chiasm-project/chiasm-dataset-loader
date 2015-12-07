var assert = require("assert"),
    Chiasm = require("chiasm"),
    ChiasmDsvDataset = require("./index");

// Use this shim so d3.csv and d3.json work.
global.XMLHttpRequest = require("xhr2");

describe("chiasm-dsv-dataset", function () {

  it("Should parse sample CSV data.", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.dsvDataset = ChiasmDsvDataset;
    
    // Load the Iris dataset.
    // See http://bl.ocks.org/curran/a08a1080b88344b0c8a7
    chiasm.setConfig({
      dsv: {
        plugin: "dsvDataset",
        state: {
          path: "http://bl.ocks.org/curran/raw/a08a1080b88344b0c8a7/iris"
        }
      }
    });

    chiasm.getComponent("dsv").then(function (dsv){
      dsv.when("dataset", function (dataset){

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
