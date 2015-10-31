"use strict";

var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateJsTasks = function generateJsTasks() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var _ref = arguments[1];
  var taskName = _ref.taskName;
  var watch = _ref.watch;
  var _ref$jsBuildTaskResul = _ref.jsBuildTaskResults.watchify;
  var generateJsWatchify = _ref$jsBuildTaskResul.generateJsTasks;
  var generateJsWatchifyResult = _ref$jsBuildTaskResul.generateJsTasksResult;
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