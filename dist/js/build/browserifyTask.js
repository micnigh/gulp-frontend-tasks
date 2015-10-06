"use strict";

var _ = require("underscore");
var path = require("path");
var duration = require("gulp-duration");
var buffer = require("gulp-buffer");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var size = require("gulp-size");
var uglify = require("gulp-uglify");
require("colors"); // add console log colors

var deepExtend = require("../../util/deepExtend");

var browserify = require("browserify");
var watchify = require("watchify");
var babelify = require("babelify");
var envify = require("envify/custom");
var source = require("vinyl-source-stream");

var isDev = "development" === process.env.BUILD_ENV;

var browserifyTask = function browserifyTask(gulp, _ref) {
  if (gulp === undefined) gulp = require("gulp");
  var taskName = _ref.taskName;
  var dest = _ref.dest;
  var destFileName = _ref.destFileName;
  var relativePath = _ref.relativePath;
  var _ref$watchify_enabled = _ref.watchify_enabled;
  var watchify_enabled = _ref$watchify_enabled === undefined ? false : _ref$watchify_enabled;
  var browserifyOptions = _ref.browserifyOptions;

  browserifyOptions = deepExtend({
    extensions: [".js", ".jsx", ".es6"],
    externals: [],
    requires: [],
    transformConfigs: {}
  }, browserifyOptions);

  if (typeof destFileName === "undefined") {
    dest = dest + "/" + path.dirname(relativePath) + "/";
    destFileName = path.basename(relativePath);
  }

  var bundleEnv = _.extend({}, process.env, {
    // pass extra env info (livereload?)
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

  b.transform(babelify.configure({
    sourceMap: isDev,
    sourceMapRelative: "/source/"
  }));

  b.transform(envify(bundleEnv));

  var bundle = function bundle() {
    var bundleTimer = duration(taskName + ":bundle:" + destFileName);
    var uglifyTimer = duration(taskName + ":uglify:" + destFileName);

    var p = b.bundle().on("error", function (msg) {
      console.log(msg.toString().red);
    }).pipe(bundleTimer)

    // convert back to gulp pipe
    .pipe(source(destFileName)).pipe(buffer());

    if (isDev) {
      p.pipe(sourcemaps.init({ loadMaps: true })).pipe(rename({
        extname: ".js"
      })).pipe(sourcemaps.write("./")).pipe(gulp.dest(dest));
    } else {
      p.once("data", uglifyTimer.start).pipe(uglify()).pipe(uglifyTimer);
    }

    p.pipe(gulp.dest(dest)).pipe(size({
      showFiles: true,
      title: taskName,
      gzip: true
    }));

    p.on("end", function () {
      // TODO: figure out how to handle livereload
      // if (livereloadJs){
      //   var changeUrl = "http://127.0.0.1:" + livereloadPort + "/changed?files=index.html";
      //   console.log("Triggering livereload: " + changeUrl);
      //   request(changeUrl, function () { /* do nothing */ });
      // }
    });

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