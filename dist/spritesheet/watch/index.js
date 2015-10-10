"use strict";

module.exports = function (gulp, options) {
  if (gulp === undefined) gulp = require("gulp");

  require("./generateTasks")(gulp, options);
};