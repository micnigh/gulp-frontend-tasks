// Based off of Lodash's chunk
// See http://stackoverflow.com/a/29930022
"use strict";

module.exports = function (a, n) {
  var i = 0;
  var length = a.length;
  var ri = -1;
  var result = Array(Math.ceil(length / n));
  while (i < length) {
    result[++ri] = a.slice(i, i += n);
  }
  return result;
};