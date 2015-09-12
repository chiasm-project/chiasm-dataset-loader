var expect = require("chai").expect,
    Chiasm = require("chiasm"),
    ChiasmCSVLoader = require("../index");

XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

describe("chiasm-csv-loader", function () {

  it("Should load a sample CSV file.", function(done) {

    var chiasm = Chiasm();

    chiasm.plugins.csvLoader = ChiasmCSVLoader;
    
    chiasm.setConfig({
      csv: {
        plugin: "csvLoader",
        state: {
          "path": "./test/sample"
        }
      }
    });

    chiasm.getComponent("csv").then(function (csv){
      csv.when("data", function (data){
        console.log(data);
        done();
      });
    });
  });
});
