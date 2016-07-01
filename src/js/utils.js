'use strict';

var messageKeys = require('message_keys');

module.exports.objectToMessageKeys = function(obj) {
  var result = {};
  Object.keys(obj).forEach(function(key) {
    result[messageKeys[key]] = obj[key];
  });
};
