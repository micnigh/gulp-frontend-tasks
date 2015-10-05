_ = require("underscore");

var deepClone = function (object) {
  var clone = _.clone(object);
  _.each(clone, function (value, key) {
     if (typeof value === "object") {
       clone[key] = deepClone(value);
     }
   });
  return clone;
};

module.exports = deepClone;
