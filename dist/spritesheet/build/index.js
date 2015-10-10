"use strict";

module.exports = function (gulp, options) {
  if (gulp === undefined) gulp = require("gulp");

  return require("./generateTasks")(gulp, options);
};