"use strict";

var _ = require("underscore");
var path = require("path");
var buffer = require("gulp-buffer");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var size = require("gulp-size");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");
var prettyTime = require("pretty-hrtime");
var chalk = require("chalk");

var deepExtend = require("../../util/deepExtend");

var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");
var envify = require("envify/custom");
var source = require("vinyl-source-stream");

var isDev = "development" === process.env.NODE_ENV;

var browserifyTask = function browserifyTask() {
  var gulp = arguments.length <= 0 || arguments[0] === undefined ? require("gulp") : arguments[0];
  var _ref = arguments[1];
  var taskName = _ref.taskName;
  var dest = _ref.dest;
  var destFileName = _ref.destFileName;
  var relativePath = _ref.relativePath;
  var _ref$watchify_enabled = _ref.watchify_enabled;
  var watchify_enabled = _ref$watchify_enabled === undefined ? false : _ref$watchify_enabled;
  var browserifyOptions = _ref.browserifyOptions;
  var _ref$browsersync = _ref.browsersync;
  var browsersync = _ref$browsersync === undefined ? null : _ref$browsersync;

  var browsersyncReady = isDev && browsersync !== null && typeof browsersync.instance !== "undefined" && typeof browsersync.instance.options !== "undefined";

  browserifyOptions = deepExtend({
    extensions: [".js", ".jsx", ".es6"],
    externals: [],
    requires: [],
    transforms: {}
  }, browserifyOptions);

  if (typeof destFileName === "undefined") {
    dest = dest + "/" + path.dirname(relativePath) + "/";
    destFileName = path.basename(relativePath);
  }

  var browsersyncSnippet = null;
  if (isDev && watchify_enabled && browsersyncReady) {
    browsersyncSnippet = browsersync.instance.options.get("snippet");
  }

  var bundleEnv = _.extend({}, process.env, {
    // pass env info
    BROWSERSYNC_ENABLED: browsersyncReady ? "true" : "false",
    BROWSERSYNC_SNIPPET: browsersyncSnippet,
    _: "purge"
  });

  var _browserifyOptions = browserifyOptions;
  var externals = _browserifyOptions.externals;
  var requires = _browserifyOptions.requires;

  if (isDev) {
    _.extend(browserifyOptions, { debug: true });
  }

  if (watchify_enabled) {
    _.extend(browserifyOptions, {
      // create empty caches - so bundles wont share cache
      cache: {},
      packageCache: {}
    });
  }

  var b = browserify(browserifyOptions);

  for (var i = 0; i < externals.length; i++) {
    b.external(externals[i]);
  }

  for (var i = 0; i < requires.length; i++) {
    b.require(requires[i]);
  }

  b.transform(babelify.configure(deepExtend({
    sourceMap: isDev,
    sourceMapRelative: "/source/"
  }, browserifyOptions.transforms.babelify)));

  b.transform(envify(bundleEnv));
  b.transform("strictify");

  var bundle = function bundle() {
    var bundleStartTime = process.hrtime();
    var uglifyStartTime = null;

    var p = b.bundle().on("error", function (msg) {
      gutil.log(chalk.red(msg.toString()));
    }).on("end", function () {
      gutil.log("Bundled " + chalk.cyan(taskName + ":bundle:" + destFileName) + " " + chalk.magenta(prettyTime(process.hrtime(bundleStartTime))));
    })

    // convert back to gulp pipe
    .pipe(source(destFileName)).pipe(buffer());

    if (isDev) {
      p = p.pipe(sourcemaps.init({ loadMaps: true })).pipe(rename({
        extname: ".js"
      })).pipe(sourcemaps.write("./")).pipe(gulp.dest(dest));
    } else {
      p = p.once("data", function () {
        uglifyStartTime = process.hrtime();
      }).pipe(uglify()).on("end", function () {
        gutil.log("Uglified " + chalk.cyan(taskName + ":uglify:" + destFileName) + " " + chalk.magenta(prettyTime(process.hrtime(uglifyStartTime))));
      });
    }

    p = p.pipe(gulp.dest(dest));

    if (isDev && watchify_enabled && browsersync !== null) {
      p = p.pipe(browsersync.stream({ match: [/.js$/] }));
    }

    p = p.pipe(size({
      showFiles: true,
      title: taskName,
      gzip: true
    }));

    return p;
  };

  if (watchify_enabled) {
    b = watchify(b);
    b.on("update", bundle);
  }

  return {
    taskName: taskName,
    pipe: bundle(),
    bundle: b
  };
};

module.exports = browserifyTask;