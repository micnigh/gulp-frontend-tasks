"use strict";

var deepExtend = require("../util/deepExtend");

module.exports = function () {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var options = arguments[1];

  var jsBuildTaskResults = require("./build/")(gulp, options);
  require("./watch/")(gulp, deepExtend({}, options, {
    jsBuildTaskResults: jsBuildTaskResults
  }));
};