var gulp = require("gulp");

var tasks = {
  "js": require("./dist/js/"),
  "css:less": require("./dist/css/less/"),
  "css:scss": require("./dist/css/scss/"),
  "spritesheet": require("./dist/spritesheet/"),
};

module.exports = function (passedGulp) {
  gulp = passedGulp;
  return module.exports;
};

module.exports.generateTask = function (taskType, options) {
  return tasks[taskType](gulp, options);
};
