"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

_ = require("underscore");

var deepClone = function deepClone(object) {
  var clone = _.clone(object);
  _.each(clone, function (value, key) {
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
      clone[key] = deepClone(value);
    }
  });
  return clone;
};

module.exports = deepClone;