var deepExtend = require("../../util/deepExtend");
var spritesheetTask = require("./spritesheetTask");

var generateLessTasks = function (gulp = require("gulp"), options) {
  var {
    taskName: taskName,
    dependsOn: dependsOn = [],
  } = options;

  taskName = "build:spritesheet:" + taskName;

  options = deepExtend({}, options, {
    taskName: taskName,
    dependsOn: dependsOn,
  });

  return spritesheetTask(gulp, options);
  // gulp.task(taskName, dependsOn, function () {
  //   return spritesheetTask(gulp, options);
  // });
};

module.exports = generateLessTasks;
