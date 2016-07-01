'use strict';

var messageKeys = require('message_keys');
var objectToMessageKeys = require('./utils').objectToMessageKeys;

/**
 * @return {void}
 */
function simpleAppMessage() { }

simpleAppMessage._chunkSize = 0;

/**
 * @param {object} data
 * @param {function} callback
 * @return {void}
 */
simpleAppMessage.send = function(data, callback) {
  if (!simpleAppMessage._chunkSize) {

    // fetch chunk size
    Pebble.addEventListener('appmessage', function(e) {
      simpleAppMessage._chunkSize =
        e.payload[messageKeys.SIMPLE_APP_MESSAGE_CHUNK_SIZE];
    });

    Pebble.sendAppMessage(objectToMessageKeys({
      SIMPLE_APP_MESSAGE_CHUNK_SIZE: 1
    }), function() {
      // success

    }, function(error) {
      console.log('Failed to request chunk size!');
      console.log(JSON.stringify(error));
    });
  } else {
    simpleAppMessage._send(data, callback)
  }
};

/**
 * @private
 */
simpleAppMessage._send = function() {

}

/**
 * serialize and object into an Array ready for transport via appMessage
 * @param {object} data
 * @return {Array}
 */
simpleAppMessage.serialize = function(data) {
  var keys = Object.keys(data);
  var length = keys.length;
  var result = [];
  var TYPES = {
    NULL: 0,
    BOOL: 1,
    INT: 2,
    DATA: 3,
    STRING: 4
  };

  /**
   * @private
   * @param {null|boolean|string|Array|number} val
   * @param {boolean} [useTerminator=true]
   * @return {void}
   */
  function _pushResult(val, useTerminator) {
    if (useTerminator) {
      result = result.concat(val, '\0');
    } else {
      result = result.concat(val);
    }
  }

  if (length > 255) {
    throw new Error('Number of items must be less than 255');
  }

  // number of keys
  _pushResult(length);

  for (var i = 0; i < length; i++) {
    var key = keys[i];
    var val = data[key];

    // key
    _pushResult(key.split(''), true);

    switch (typeof val) {
      case 'object' :
        if (val === null) {
          _pushResult(TYPES.NULL);
        } else if (Array.isArray(val)) {
          _pushResult(TYPES.DATA);
          _pushResult(
            [
              (val.length >>> 8) & 255,
              (val.length >>> 0) & 255
            ].concat(val)
          );
        }
        break;

      case 'number' :
        _pushResult(TYPES.INT);
        _pushResult([
          (val >>> 24) & 255,
          (val >>> 16) & 255,
          (val >>> 8) & 255,
          (val >>> 0) & 255
        ]);
        break;

      case 'string' :
        _pushResult(TYPES.STRING);
        _pushResult(val.split(''), true);
        break;

      case 'boolean' :
        _pushResult(TYPES.BOOL);
        _pushResult(val ? 1 : 0);
        break;
    }

  }

  return result;
};

module.exports = simpleAppMessage;
