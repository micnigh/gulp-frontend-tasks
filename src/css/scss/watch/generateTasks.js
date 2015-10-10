var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateLessTasks = function (gulp = require("gulp"),{
  taskName: taskName,
  watch: watch,
}) {
  var buildTaskName = "build:css:scss:" + taskName;
  taskName = "watch:css:scss:" + taskName;
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

module.exports = generateLessTasks;
