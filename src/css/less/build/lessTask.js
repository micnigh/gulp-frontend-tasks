var less = require("gulp-less");
var sourcemaps = require("gulp-sourcemaps");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({ advanced: true });
var autoprefixer = require("gulp-autoprefixer");
var size = require("gulp-size");
require("colors"); // allow printing to the console in different colors

var isDev = "development" === process.env.BUILD_ENV;

var generateLessTask = function (gulp = require("gulp"), options) {
  var {
    taskName: taskName,
    entries: entries,
    includes: includes = [
      "node_modules/",
    ],
    dest: dest,
  } = options;

  var lessPlugins = [];
  if (!isDev) {
    lessPlugins = [ cleancss ];
  }

  var lessPipe = gulp.src(entries);

  if (isDev) {
    lessPipe = lessPipe.pipe(sourcemaps.init());
  }

  lessPipe = lessPipe.pipe(less({
    plugins: lessPlugins,
    paths: includes,
  }))
    .on("error", function (msg) {
      msg.showProperties = false;
      console.log(msg.toString().red);
      this.emit("end");
    })
    .pipe(autoprefixer());

  if (isDev) {
    lessPipe = lessPipe
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(dest));
  }

  lessPipe = lessPipe.pipe(gulp.dest(dest));

  if (isDev) {
    // TODO: livereload here
  }

  return lessPipe.pipe(size({
    showFiles: true,
    title: taskName,
    gzip: true,
  }));
};

module.exports = generateLessTask;
