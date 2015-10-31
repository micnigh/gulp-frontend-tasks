"use strict";

module.exports = function () {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var options = arguments[1];

  require("./build/")(gulp, options);
  require("./watch/")(gulp, options);
};