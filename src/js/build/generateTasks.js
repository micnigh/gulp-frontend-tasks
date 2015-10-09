var glob = require("glob");
var deepExtend = require("../../util/deepExtend");

var browserifyTask = require("./browserifyTask");

var generateJsTask = function (gulp = require("gulp"), options) {
  var generateJsBrowserifyTaskWrapper = function ({
    taskName: taskName,
    entries: entries,
    includes: includes = [
      "node_modules/",
      "shared/",
    ],
    dest: dest,
    destFileName: destFileName,
    browserify: browserifyOptions,
    watchify_enabled: watchify_enabled = false,
    browsersync: browsersync,
  }) {
    var runningBrowserifyTasks = [];

    gulp.task("build:js:" + taskName, ["build:js:browserify:" + taskName]);

    if (!watchify_enabled) {
      taskName = "build:js:browserify:" + taskName;
    } else {
      taskName = "build:js:watchify:" + taskName;
    }

    var subTasks = [];
    entries.forEach((entry) => {
      var entryFiles = glob.sync(entry);
      entryFiles.forEach(entryFile => {
        var relativePath = entryFile.replace(entry.split("*")[0], "");
        var entryFileTaskName = taskName + ":" + entryFile;

        var browserifyTaskOptions = {
          taskName: entryFileTaskName,
          destFileName: destFileName,
          dest: dest,
          relativePath: relativePath,
          browsersync: browsersync,
          browserifyOptions: deepExtend({}, browserifyOptions, {
            entries: [
              entryFile,
            ],
            paths: includes,
          }),
        };

        if (watchify_enabled) {
          browserifyTaskOptions = deepExtend({}, browserifyTaskOptions, {
            watchify_enabled: true,
          });
        }

        subTasks.push(entryFileTaskName);
        gulp.task(entryFileTaskName, function () {
          var browserifyTaskResult = browserifyTask(gulp, browserifyTaskOptions);
          runningBrowserifyTasks.push(browserifyTaskResult);
          return browserifyTaskResult.pipe;
        });
      });
    });
    gulp.task(taskName, subTasks);

    var stopRunningTasks = function () {
      runningBrowserifyTasks.forEach(function ({ taskName: taskName, pipe: pipe, bundle: bundle }) {
        pipe.emit("exit");
        if (typeof bundle.close !== "undefined") {
          console.log("closing browserify task for " + taskName + "");
          pipe.emit("exit");
          bundle.reset();
        }
      });
    };

    return {
      stopRunningTasks: stopRunningTasks,
    };
  };

  var generateJsBrowserify = function (previousGenerateJsBrowserifyResult = null) {
    if (previousGenerateJsBrowserifyResult !== null) {
      previousGenerateJsBrowserifyResult.stopRunningTasks();
    }
    return generateJsBrowserifyTaskWrapper(options);
  };
  var generateJsBrowserifyResult = generateJsBrowserify();

  var generateJsWatchify = function (previousGenerateJsWatchifyResult = null) {
    if (previousGenerateJsWatchifyResult !== null) {
      previousGenerateJsWatchifyResult.stopRunningTasks();
    }
    return generateJsBrowserifyTaskWrapper(deepExtend({}, options, {
      watchify_enabled: true
    }));
  };
  var generateJsWatchifyResult = generateJsWatchify();

  return {
    browserify: {
      generateJsTasks: generateJsBrowserify,
      generateJsTasksResult: generateJsBrowserifyResult,
    },
    watchify: {
      generateJsTasks: generateJsWatchify,
      generateJsTasksResult: generateJsWatchifyResult,
    }
  };
};



module.exports = generateJsTask;
