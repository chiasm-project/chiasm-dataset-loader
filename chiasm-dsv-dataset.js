(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChiasmDsvDataset = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
//chiasm-csv-loader.js
//v0.2.0
//
//A Chiasm plugin that loads CSV files.

var Model = (typeof window !== "undefined" ? window['Model'] : typeof global !== "undefined" ? global['Model'] : null);
var ChiasmComponent = (typeof window !== "undefined" ? window['ChiasmComponent'] : typeof global !== "undefined" ? global['ChiasmComponent'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);
var dsvDataset = require("dsv-dataset");

function ChiasmCSVLoader (){

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

module.exports = ChiasmCSVLoader;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"dsv-dataset":2}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.dsvDataset = factory();
}(this, function () { 'use strict';

  function dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    function parse(text, f) {
      var o;
      return parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) { return f(a(row), i); } : a;
      });
    }

    function parseRows(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    function format(rows) {
      if (Array.isArray(rows[0])) return formatRows(rows); // deprecated; use formatRows
      var fieldSet = Object.create(null), fields = [];

      // Compute unique fields in order of discovery.
      rows.forEach(function(row) {
        for (var field in row) {
          if (!((field += "") in fieldSet)) {
            fields.push(fieldSet[field] = field);
          }
        }
      });

      return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    };
  }

  var parseFunctions = {
    // implicitly: string: function (str){ return str; },
    number: parseFloat,
    date: function (str) {
      return new Date(str);
    }
  };

  function generateColumnParsers(metadata) {
    if("columns" in metadata){
      return metadata.columns
        .filter(function (column){
          return column.type !== "string";
        })
        .map(function (column){
          var parse = parseFunctions[column.type];
          var name = column.name;
          return function (d){
            d[name] = parse(d[name]);
          }
        });
    } else {
      return [];
    }
  }

  var index = {
    parse: function (dataset){

      var dsvString = dataset.dsvString;

      // Handle the case where `metadata` is not speficied.
      var metadata = dataset.metadata || {};

      // Default to CSV if no delimiter speficied.
      var delimiter = metadata.delimiter || ",";

      var columnParsers = generateColumnParsers(metadata);
      var numColumns = columnParsers.length;

      dataset.data = dsv(delimiter).parse(dsvString, function (d){

        // Old school for loop as an optimization.
        for(var i = 0; i < numColumns; i++){

          // Each column parser function mutates the row object,
          // replacing the column property string with its parsed variant.
          columnParsers[i](d);
        }
        return d;
      });

      return dataset;
    }
  };

  return index;

}));
},{}]},{},[1])(1)
});