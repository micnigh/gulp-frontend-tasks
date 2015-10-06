var _ = require("underscore");
var gWatch = require("gulp-watch");

var generateJsTasks = function (gulp = require("gulp"),{
  taskName: taskName,
  watch: watch,
  jsBuildTaskResults: {
    watchify: {
      generateJsTasks: generateJsWatchify,
      generateJsTasksResult: generateJsWatchifyResult,
    },
  },
}) {
  var buildTaskName = "build:js:watchify:" + taskName;
  taskName = "watch:js:" + taskName;
  gulp.task(taskName, function () {
    gulp.start(buildTaskName);
    return gWatch(
      watch,
      _.debounce(function (file) {
        if (/^(add|unlink)$/.test(file.event)){
          generateJsWatchifyResult = generateJsWatchify(generateJsWatchifyResult);
          gulp.start(buildTaskName);
        }
      }, 100)
    );
  });
};

module.exports = generateJsTasks;
