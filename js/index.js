var deepExtend = require("../util/deepExtend");

module.exports = function (gulp = require("gulp"), options) {
  var jsBuildTaskResults = require("./build/")(gulp, options);
  require("./watch/")(gulp, deepExtend({}, options, {
    jsBuildTaskResults: jsBuildTaskResults,
  }));
};
