"use strict";

_ = require("underscore");

var deepClone = function deepClone(object) {
  var clone = _.clone(object);
  _.each(clone, function (value, key) {
    if (typeof value === "object") {
      clone[key] = deepClone(value);
    }
  });
  return clone;
};

module.exports = deepClone;