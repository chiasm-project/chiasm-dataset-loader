# chiasm-dataset-loader
A Chiasm component that loads delimiter separated value (DSV) data tables. This is a thin wrapper around the [dsv-dataset module](https://github.com/curran/dsv-dataset), which is a metadata specification and parsing library for data sets. Take a look at the [unit test](https://github.com/chiasm-project/chiasm-dsv-dataset/blob/master/test.js) for example usage. When a "path" property is specified, the component appends ".csv" and ".json" to it and uses an XMLHttpRequest to fetch those two paths. The ".csv" fils should contain a data table, and the ".json" file should contain metadata about the table including column types.

Example use:

The following script will set up the component in a Chiasm application:
```javascript
var ChiasmDatasetLoader = require("chiasm-dataset-loader");
var chiasm = Chiasm();
chiasm.plugins.datasetLoader = ChiasmDatasetLoader;
chiasm.setConfig({
  loader: {
    plugin: "datasetLoader",
    state: {
      path: "http://bl.ocks.org/curran/raw/a08a1080b88344b0c8a7/iris"
    }
  }
});
```

Here are a few sample lines from `http://bl.ocks.org/curran/raw/a08a1080b88344b0c8a7/iris.csv`:

```
sepal_length,sepal_width,petal_length,petal_width,class
5.3,3.7,1.5,0.2,setosa
5.7,2.8,4.1,1.3,versicolor
5.8,2.7,5.1,1.9,virginica
```

Here is the content of `http://bl.ocks.org/curran/raw/a08a1080b88344b0c8a7/iris.json`:

```json
{
  "columns": [
    { "name": "sepal_length", "type": "number", "label": "Sepal Length" },
    { "name": "sepal_width",  "type": "number", "label": "Sepal Width" },
    { "name": "petal_length", "type": "number", "label": "Petal Length" },
    { "name": "petal_width",  "type": "number", "label": "Petal Width" },
    { "name": "class",        "type": "string", "label": "Species" }
  ]
}
```

The following code will print out the parsed table:

```javascript
chiasm.getComponent("loader").then(function (loader){
  loader.when("dataset", function (dataset){
    console.log(JSON.stringify(dataset, null, 2));
  });
});
```

The following JSON will be printed:
```json
{
  "data": [
    {
      "sepal_length": 5.1,
      "sepal_width": 3.5,
      "petal_length": 1.4,
      "petal_width": 0.2,
      "class": "setosa"
    },
    {
      "sepal_length": 6.2,
      "sepal_width": 2.9,
      "petal_length": 4.3,
      "petal_width": 1.3,
      "class": "versicolor"
    },
    {
      "sepal_length": 6.3,
      "sepal_width": 3.3,
      "petal_length": 6,
      "petal_width": 2.5,
      "class": "virginica"
    },
    ... more rows of data ...
  ],
  "metadata": {
    "columns": [
      { "name": "sepal_length", "type": "number", "label": "Sepal Length" },
      { "name": "sepal_width", "type": "number", "label": "Sepal Width" },
      { "name": "petal_length", "type": "number", "label": "Petal Length" },
      { "name": "petal_width", "type": "number", "label": "Petal Width" },
      { "name": "class", "type": "string", "label": "Species" }
    ]
  ]
}
```

Notice how numeric columns have been parsed to numbers. This data structure is an instance of [chiasm-dataset](https://github.com/chiasm-project/chiasm-dataset).

To see how this component can be used to fetch data for visualizations, check out this [Magic Bar Chart example](http://bl.ocks.org/curran/b6e1d23c16dc76371a92).
