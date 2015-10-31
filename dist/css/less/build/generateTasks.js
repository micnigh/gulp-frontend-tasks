var deepExtend = require("../../../util/deepExtend");
var lessTask = require("./lessTask");

var generateLessTasks = function (gulp = require("gulp"), options) {
  var {
    taskName: taskName,
    dependsOn = []
  } = options;

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