var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var gutil = require("gulp-util");
var size = require("gulp-size");
var chalk = require("chalk");

var isDev = "development" === process.env.BUILD_ENV;

var generateScssTask = function (gulp = require("gulp"), options) {
  var {
    taskName: taskName,
    entries: entries,
    includes: includes = [
      "node_modules/",
    ],
    dest: dest,
    browsersync: browsersync = null,
  } = options;

  var scssPipe = gulp.src(entries);

  if (isDev) {
    scssPipe = scssPipe.pipe(sourcemaps.init());
  }

  scssPipe = scssPipe.pipe(sass({
    includePaths: includes,
    outputStyle: isDev ? "nested" : "compressed",
  }))
    .on("error", function (msg) {
      msg.showProperties = false;
      gutil.log(chalk.red(msg.toString()));
      this.emit("end");
    })
    .pipe(autoprefixer());

  if (isDev) {
    scssPipe = scssPipe
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(dest));
  }

  scssPipe = scssPipe.pipe(gulp.dest(dest));

  if (isDev && browsersync !== null) {
    scssPipe = scssPipe.pipe(browsersync.stream({ match: [
      /.css$/,
    ]}));
  }

  scssPipe = scssPipe.pipe(size({
    showFiles: true,
    title: taskName,
    gzip: true,
  }));

  return scssPipe;
};

module.exports = generateScssTask;
