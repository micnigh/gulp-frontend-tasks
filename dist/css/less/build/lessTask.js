"use strict";

var less = require("gulp-less");
var sourcemaps = require("gulp-sourcemaps");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({ advanced: true });
var autoprefixer = require("gulp-autoprefixer");
var gutil = require("gulp-util");
var size = require("gulp-size");
var chalk = require("chalk");

var isDev = "development" === process.env.BUILD_ENV;

var generateLessTask = function generateLessTask(gulp, options) {
  if (gulp === undefined) gulp = require("gulp");
  var taskName = options.taskName;
  var entries = options.entries;
  var _options$includes = options.includes;
  var includes = _options$includes === undefined ? ["node_modules/"] : _options$includes;
  var dest = options.dest;
  var _options$browsersync = options.browsersync;
  var browsersync = _options$browsersync === undefined ? null : _options$browsersync;

  var lessPlugins = [];
  if (!isDev) {
    lessPlugins = [cleancss];
  }

  var lessPipe = gulp.src(entries);

  if (isDev) {
    lessPipe = lessPipe.pipe(sourcemaps.init());
  }

  lessPipe = lessPipe.pipe(less({
    plugins: lessPlugins,
    paths: includes
  })).on("error", function (msg) {
    msg.showProperties = false;
    gutil.log(chalk.red(msg.toString()));
    this.emit("end");
  }).pipe(autoprefixer());

  if (isDev) {
    lessPipe = lessPipe.pipe(sourcemaps.write("./")).pipe(gulp.dest(dest));
  }

  lessPipe = lessPipe.pipe(gulp.dest(dest));

  if (isDev && browsersync !== null) {
    lessPipe = lessPipe.pipe(browsersync.stream({ match: [/.css$/] }));
  }

  lessPipe = lessPipe.pipe(size({
    showFiles: true,
    title: taskName,
    gzip: true
  }));

  return lessPipe;
};

module.exports = generateLessTask;