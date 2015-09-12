// A Chiasm plugin for loading CSV files.
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
