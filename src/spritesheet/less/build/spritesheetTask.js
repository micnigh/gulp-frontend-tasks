var imagemin = require("gulp-imagemin");
var spritesmith = require("gulp.spritesmith");
var merge = require("merge-stream");
var del = require("del");
var fs = require("fs");
var path = require("path");
var es = require("event-stream");
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var crypto = require("crypto");

var generateSpritesheetTask = function (gulp = require("gulp"), options) {
  var {
    taskName: taskName,
    src: src,
    dest: dest,
    destFileName: destFileName,
    lessSpriteFile: lessSpriteFile,
    dependsOn: dependsOn,
  } = options;

  gulp.task(taskName, dependsOn.concat([
    taskName + ":build",
    taskName + ":inject-md5-name-into-css",
  ]));

  var spriteSmith = null;
  var lessFileName = path.basename(lessSpriteFile);
  var newSpritesheetName = "spritesheet_" + (+ new Date()) + ".png";
  var md5SpritesheetName = "";
  var md5Png = "";

  var spriteOutputFolder = dest;
  var spriteLessOutputFolder = path.dirname(lessSpriteFile);
  var spriteLessOutputFile = lessSpriteFile;

  gulp.task(taskName + ":build", function () {
    newSpritesheetName = "spritesheet_" + (+ new Date());

    del([spriteOutputFolder + "/spritesheet*.png"]);

    // touch sprites.less to create if it doesnt exist
    fs.closeSync(fs.openSync(spriteLessOutputFile, "w"));

    spriteSmith = gulp.src(src)
    .pipe(spritesmith({
      imgName: newSpritesheetName + ".png",
      cssName: lessFileName
    }));

    var imgPipe = spriteSmith.img
      .pipe(imagemin())
      .pipe(es.map(function (file, cb) {
        md5Png = crypto.createHash("md5").update(file.contents).digest("hex").slice(0, 10);
        md5SpritesheetName = destFileName + md5Png;
        cb(null, file);
      }))
      .pipe(rename(function (path) {
        path.basename = md5SpritesheetName;
        return path;
      }))
      .pipe(gulp.dest(spriteOutputFolder));

    var cssPipe = spriteSmith.css
      .pipe(gulp.dest(spriteLessOutputFolder));

    return merge(imgPipe, cssPipe);
  });

  gulp.task(taskName + ":inject-md5-name-into-css", [
    taskName + ":build",
  ], function () {
    var p = gulp.src(spriteLessOutputFile)
      .pipe(replace(new RegExp(newSpritesheetName, "g"), md5SpritesheetName))
      .pipe(gulp.dest(spriteLessOutputFolder));
    return p;
  });
};

module.exports = generateSpritesheetTask;
