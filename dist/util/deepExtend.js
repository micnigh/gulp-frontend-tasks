"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _ = require("underscore");

// based off of http://stackoverflow.com/a/29563346
// extended to support multiple arguments
function deepExtendObj(target, source) {
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      if (target[prop] && _typeof(source[prop]) === "object") {
        deepExtendObj(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}

module.exports = function deepExtend() {
  var result = arguments[0];
  var extensions = Array.prototype.slice.call(arguments, 1);
  _.each(extensions, function (extension) {
    result = deepExtendObj(result, extension);
  });
  return result;
};