(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChiasmCSVLoader = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
//chiasm-csv-loader.js
//v0.2.0
//
//A Chiasm plugin that loads CSV files.

var Model = (typeof window !== "undefined" ? window['Model'] : typeof global !== "undefined" ? global['Model'] : null);
var ChiasmComponent = (typeof window !== "undefined" ? window['ChiasmComponent'] : typeof global !== "undefined" ? global['ChiasmComponent'] : null);
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});