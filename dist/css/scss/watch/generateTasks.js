"use strict";

var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateLessTasks = function generateLessTasks() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var _ref = arguments[1];
  var taskName = _ref.taskName;
  var watch = _ref.watch;

  var buildTaskName = "build:css:scss:" + taskName;
  taskName = "watch:css:scss:" + taskName;
  gulp.task(taskName, function () {
    gulp.start(buildTaskName);
    return gWatch(watch, _.debounce(function () {
      gulp.start(buildTaskName);
    }, 100));
  });
};

module.exports = generateLessTasks;