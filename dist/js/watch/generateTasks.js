"use strict";

var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateJsTasks = function generateJsTasks(gulp, _ref) {
  if (gulp === undefined) gulp = require("gulp");
  var taskName = _ref.taskName;
  var watch = _ref.watch;
  var _ref$jsBuildTaskResults$watchify = _ref.jsBuildTaskResults.watchify;
  var generateJsWatchify = _ref$jsBuildTaskResults$watchify.generateJsTasks;
  var generateJsWatchifyResult = _ref$jsBuildTaskResults$watchify.generateJsTasksResult;
  var _ref$browsersync = _ref.browsersync;
  var browsersync = _ref$browsersync === undefined ? null : _ref$browsersync;

  var buildTaskName = "build:js:watchify:" + taskName;
  if (browsersync !== null) {
    browsersync.instance.emitter.on("init", function () {
      // regenerate js so we can embed browsersync snippet
      console.log("browsersync ready - reload task " + buildTaskName);
      generateJsWatchifyResult = generateJsWatchify(generateJsWatchifyResult);
      gulp.start(buildTaskName);
    });
  }
  taskName = "watch:js:" + taskName;
  gulp.task(taskName, function () {
    gulp.start(buildTaskName);
    return gWatch(watch, _.debounce(function (file) {
      if (/^(add|unlink)$/.test(file.event)) {
        generateJsWatchifyResult = generateJsWatchify(generateJsWatchifyResult);
        gulp.start(buildTaskName);
      }
    }, 100));
  });
};

module.exports = generateJsTasks;