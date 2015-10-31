var _ = require("underscore");
var gulp = require("gulp");
var babel = require("gulp-babel");
var gWatch = require("gulp-watch");

gulp.task("babel", function() {
  return gulp.src("src/**/*.js")
    .pipe(babel({
      presets: ["babel-preset-es2015"],
    }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("watch", ["babel"], function() {
  return gWatch("src/**/*.js", _.debounce(function (file) {
    gulp.start("babel");
  }, 100));
});

gulp.task("default", ["babel"]);
