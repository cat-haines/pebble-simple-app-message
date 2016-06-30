'use strict';

/**
 * @return {void}
 */
function simpleAppMessage() { }

/**
 * serialize and object into an Array ready for transport via appMessage
 * @param {object} data
 * @returns {Array}
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
   * @return {void}
   * @param {null|boolean|string|Array|number} val
   * @param {boolean} [useTerminator=true]
   */
  function pushResult(val, useTerminator) {
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
  pushResult(length);

  for (var i = 0; i < length; i++) {
    var key = keys[i];
    var val = data[key];

    // key
    pushResult(key.split(''), true);

    switch (typeof val) {
      case 'object' :
        if (val === null) {
          pushResult(TYPES.NULL);
        } else if (Array.isArray(val)) {
          pushResult(TYPES.DATA);
          pushResult(
            [
              (val.length >>> 8) & 255,
              (val.length >>> 0) & 255
            ].concat(val)
          );
        }
        break;

      case 'number' :
        pushResult(TYPES.INT);
        pushResult([
          (val >>> 24) & 255,
          (val >>> 16) & 255,
          (val >>> 8) & 255,
          (val >>> 0) & 255
        ]);
        break;

      case 'string' :
        pushResult(TYPES.STRING);
        pushResult(val.split(''), true);
        break;

      case 'boolean' :
        pushResult(TYPES.BOOL);
        pushResult(val ? 1 : 0);
        break;
    }

  }

  return result;
};

module.exports = simpleAppMessage;
