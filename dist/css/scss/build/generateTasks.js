"use strict";

var deepExtend = require("../../../util/deepExtend");
var lessTask = require("./scssTask");

var generateLessTasks = function generateLessTasks() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var options = arguments[1];
  var _options = options;
  var taskName = _options.taskName;
  var _options$dependsOn = _options.dependsOn;
  var dependsOn = _options$dependsOn === undefined ? [] : _options$dependsOn;

  taskName = "build:css:scss:" + taskName;

  options = deepExtend({}, options, {
    taskName: taskName,
    dependsOn: dependsOn
  });

  gulp.task(taskName, dependsOn, function () {
    return lessTask(gulp, options);
  });
};

module.exports = generateLessTasks;