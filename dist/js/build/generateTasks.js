"use strict";

var glob = require("glob");
var deepExtend = require("../../util/deepExtend");

var browserifyTask = require("./browserifyTask");

var generateJsTask = function generateJsTask() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var options = arguments[1];

  var generateJsBrowserifyTaskWrapper = function generateJsBrowserifyTaskWrapper(_ref) {
    var taskName = _ref.taskName;
    var entries = _ref.entries;
    var _ref$includes = _ref.includes;
    var includes = _ref$includes === undefined ? ["node_modules/", "shared/"] : _ref$includes;
    var dest = _ref.dest;
    var destFileName = _ref.destFileName;
    var browserifyOptions = _ref.browserify;
    var _ref$watchify_enabled = _ref.watchify_enabled;
    var watchify_enabled = _ref$watchify_enabled === undefined ? false : _ref$watchify_enabled;
    var browsersync = _ref.browsersync;

    var runningBrowserifyTasks = [];

    gulp.task("build:js:" + taskName, ["build:js:browserify:" + taskName]);

    if (!watchify_enabled) {
      taskName = "build:js:browserify:" + taskName;
    } else {
      taskName = "build:js:watchify:" + taskName;
    }

    var subTasks = [];
    entries.forEach(function (entry) {
      var entryFiles = glob.sync(entry);
      entryFiles.forEach(function (entryFile) {
        var relativePath = entryFile.replace(entry.split("*")[0], "");
        var entryFileTaskName = taskName + ":" + entryFile;

        var browserifyTaskOptions = {
          taskName: entryFileTaskName,
          destFileName: destFileName,
          dest: dest,
          relativePath: relativePath,
          browsersync: browsersync,
          browserifyOptions: deepExtend({}, browserifyOptions, {
            entries: [entryFile],
            paths: includes
          })
        };

        if (watchify_enabled) {
          browserifyTaskOptions = deepExtend({}, browserifyTaskOptions, {
            watchify_enabled: true
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

    var stopRunningTasks = function stopRunningTasks() {
      runningBrowserifyTasks.forEach(function (_ref2) {
        var taskName = _ref2.taskName;
        var pipe = _ref2.pipe;
        var bundle = _ref2.bundle;

        pipe.emit("exit");
        if (typeof bundle.close !== "undefined") {
          console.log("closing browserify task " + taskName + "");
          pipe.emit("exit");
          bundle.reset();
        }
      });
    };

    return {
      stopRunningTasks: stopRunningTasks
    };
  };

  var generateJsBrowserify = function generateJsBrowserify() {
    var previousGenerateJsBrowserifyResult = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    if (previousGenerateJsBrowserifyResult !== null) {
      previousGenerateJsBrowserifyResult.stopRunningTasks();
    }
    return generateJsBrowserifyTaskWrapper(options);
  };
  var generateJsBrowserifyResult = generateJsBrowserify();

  var generateJsWatchify = function generateJsWatchify() {
    var previousGenerateJsWatchifyResult = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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
      generateJsTasksResult: generateJsBrowserifyResult
    },
    watchify: {
      generateJsTasks: generateJsWatchify,
      generateJsTasksResult: generateJsWatchifyResult
    }
  };
};

module.exports = generateJsTask;