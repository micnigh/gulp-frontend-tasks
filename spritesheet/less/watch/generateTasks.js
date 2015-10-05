var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateSpritesheetTasks = function (gulp = require("gulp"),{
  taskName: taskName,
  watch: watch,
}) {
  var buildTaskName = "build:spritesheet:less:" + taskName;
  taskName = "watch:spritesheet:less:" + taskName;
  gulp.task(taskName, function () {
    gulp.start(buildTaskName);
    return gWatch(
      watch,
      _.debounce(function () {
        gulp.start(buildTaskName);
      }, 100)
    );
  });
};

module.exports = generateSpritesheetTasks;
