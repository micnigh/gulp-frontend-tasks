module.exports = function (gulp = require("gulp"), options) {
  return require("./generateTasks")(gulp, options);
};