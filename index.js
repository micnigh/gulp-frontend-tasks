var gulp = require("gulp");

var tasks = {
  "js": require("./dist/js/"),
  "css:less": require("./dist/css/less/"),
  "spritesheet:less": require("./dist/spritesheet/less/"),
};

module.exports = function (passedGulp) {
  gulp = passedGulp;
  return module.exports;
};

module.exports.generateTask = function (taskType, options) {
  return tasks[taskType](gulp, options);
};
