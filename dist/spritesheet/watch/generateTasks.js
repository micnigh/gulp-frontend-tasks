"use strict";

var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateSpritesheetTasks = function generateSpritesheetTasks(gulp, _ref) {
  if (gulp === undefined) gulp = require("gulp");
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