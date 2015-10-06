"use strict";

var deepExtend = require("../util/deepExtend");

module.exports = function (gulp, options) {
  if (gulp === undefined) gulp = require("gulp");

  var jsBuildTaskResults = require("./build/")(gulp, options);
  require("./watch/")(gulp, deepExtend({}, options, {
    jsBuildTaskResults: jsBuildTaskResults
  }));
};