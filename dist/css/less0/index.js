"use strict";

module.exports = function (gulp, options) {
  if (gulp === undefined) gulp = require("gulp");

  require("./build/")(gulp, options);
  require("./watch/")(gulp, options);
};