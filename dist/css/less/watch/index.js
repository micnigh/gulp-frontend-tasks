module.exports = function (gulp = require("gulp"), options) {
  require("./generateTasks")(gulp, options);
};