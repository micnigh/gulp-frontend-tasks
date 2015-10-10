"use strict";

var deepExtend = require("../../../util/deepExtend");
var lessTask = require("./lessTask");

var generateLessTasks = function generateLessTasks(gulp, options) {
  if (gulp === undefined) gulp = require("gulp");
  var _options = options;
  var taskName = _options.taskName;
  var _options$dependsOn = _options.dependsOn;
  var dependsOn = _options$dependsOn === undefined ? [] : _options$dependsOn;

  taskName = "build:css:less:" + taskName;

  options = deepExtend({}, options, {
    taskName: taskName,
    dependsOn: dependsOn
  });

  gulp.task(taskName, dependsOn, function () {
    return lessTask(gulp, options);
  });
};

module.exports = generateLessTasks;