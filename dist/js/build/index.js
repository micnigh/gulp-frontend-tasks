"use strict";

module.exports = function () {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var options = arguments[1];

  return require("./generateTasks")(gulp, options);
};