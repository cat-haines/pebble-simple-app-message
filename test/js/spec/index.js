'use strict';
var stubs = require('../stubs');
stubs.messageKeys();

var assert = require('assert');
var simpleAppMessage = require('../../../src/js/index');
var utils = require('../../../src/js/utils');
var fixtures = require('../fixtures');
var sinon = require('sinon');

describe('simpleAppMessage', function() {
  beforeEach(function() {
    stubs.Pebble();
  });

  describe('.serialize', function() {

    // @TODO Could really use more extensive tests here
    it('correctly serializes the data', function() {
      var data = {
        Null: null,
        Bool: true,
        Int: 257,
        Data: [1, 2, 3, 4],
        String: 'test'
      };
      var expected = [
        5, 'N', 'u', 'l', 'l', '\u0000', 0, 'B', 'o', 'o', 'l', '\u0000', 1, 1, 'I',
        'n', 't', '\u0000', 2, 0, 0, 1, 1, 'D', 'a', 't', 'a', '\u0000', 3, 0, 4, 1,
        2, 3, 4, 'S', 't', 'r', 'i', 'n', 'g', '\u0000', 4, 't', 'e', 's', 't',
        '\u0000'
      ];

      assert.deepEqual(simpleAppMessage.serialize(data), expected);
    });
  });

  describe('.send', function() {
    it('fetches the chunk size if not already defined then calls ._send()',
    function(done) {
      var appMessageData = fixtures.appMessageData();
      sinon.stub(simpleAppMessage, '_send').callsArg(1);

      simpleAppMessage._chunkSize = 0;

      Pebble.sendAppMessage.callsArg(1);

      simpleAppMessage.send(appMessageData, function() {
        assert.strictEqual(simpleAppMessage._send.callCount, 1);
        simpleAppMessage._send.restore();
        done();
      });

      Pebble.addEventListener
        .withArgs('appmessage')
        .callArgWith(1, {
          payload: utils.objectToMessageKeys({ SIMPLE_APP_MESSAGE_CHUNK_SIZE: 64 })
        });

      assert(Pebble.sendAppMessage.calledWith(
        utils.objectToMessageKeys({ SIMPLE_APP_MESSAGE_CHUNK_SIZE: 1 })
      ));
      assert.strictEqual(simpleAppMessage._chunkSize, 64);
    });

    it('does not fetch the chunk size if already defined then calls ._send',
    function(done) {
      var appMessageData = fixtures.appMessageData();
      sinon.stub(simpleAppMessage, '_send').callsArg(1);

      simpleAppMessage._chunkSize = 64;

      Pebble.sendAppMessage.callsArg(1);

      simpleAppMessage.send(appMessageData, function() {
        assert.strictEqual(simpleAppMessage._send.callCount, 1);
        simpleAppMessage._send.restore();
        done();
      });

      assert(Pebble.sendAppMessage.neverCalledWith(
        utils.objectToMessageKeys({ SIMPLE_APP_MESSAGE_CHUNK_SIZE: 1 })
      ));
      assert.strictEqual(simpleAppMessage._chunkSize, 64);
    });

    it('throws if the returned chunk size is zero', function() {
      simpleAppMessage._chunkSize = 0;
      simpleAppMessage.send({}, function() {});

      assert.throws(function() {
        Pebble.addEventListener
          .withArgs('appmessage')
          .callArgWith(1, {
            payload: utils.objectToMessageKeys({ SIMPLE_APP_MESSAGE_CHUNK_SIZE: 0 })
          });
      });
      assert(Pebble.sendAppMessage.calledWith(
        utils.objectToMessageKeys({ SIMPLE_APP_MESSAGE_CHUNK_SIZE: 1 })
      ));
      assert.strictEqual(simpleAppMessage._chunkSize, 0);
    });

  });
});
