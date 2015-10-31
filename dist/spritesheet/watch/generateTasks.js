"use strict";

var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateSpritesheetTasks = function generateSpritesheetTasks() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var _ref = arguments[1];
  var taskName = _ref.taskName;
  var watch = _ref.watch;

  var buildTaskName = "build:spritesheet:" + taskName;
  taskName = "watch:spritesheet:" + taskName;
  gulp.task(taskName, function () {
    gulp.start(buildTaskName);
    return gWatch(watch, _.debounce(function () {
      gulp.start(buildTaskName);
    }, 100));
  });
};

module.exports = generateSpritesheetTasks;