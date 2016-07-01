'use strict';
var stubs = require('../stubs');
stubs.Pebble();
stubs.messageKeys();

var assert = require('assert');
var simpleAppMessage = require('../../../src/js/index');

describe('simpleAppMessage', function() {
  describe('.serialize()', function() {
    it('correctly serializes the data', function() {
      var data = {
        keyNull: null,
        keyBool: true,
        keyInt: 257,
        keyData: [1, 2, 3, 4],
        keyString: 'test'
      };
      var expected = [
        5, 'k', 'e', 'y', 'N', 'u', 'l', 'l', '\u0000', 0, 'k', 'e', 'y', 'B', 'o',
        'o', 'l', '\u0000', 1, 1, 'k', 'e', 'y', 'I', 'n', 't', '\u0000', 2, 0, 0, 1,
        1, 'k', 'e', 'y', 'D', 'a', 't', 'a', '\u0000', 3, 0, 4, 1, 2, 3, 4, 'k',
        'e', 'y', 'S', 't', 'r', 'i', 'n', 'g', '\u0000', 4, 't', 'e', 's', 't',
        '\u0000'
      ];

      assert.deepEqual(simpleAppMessage.serialize(data), expected);
    });
  });

});
