'use strict';

module.exports.activeWatchInfo = function() {
  return {
    platform: 'chalk',
    model: 'qemu_platform_chalk',
    language: 'en_US',
    firmware: {
      major: 3,
      minor: 3,
      patch: 2,
      suffix: ''
    }
  };
};

module.exports.accountToken = function() {
  return '0123456789abcdef0123456789abcdef';
};

module.exports.watchToken = function() {
  return '0123456789abcdef0123456789abcdef';
};

module.exports.messageKeys = function() {
  return {
    SIMPLE_APP_MESSAGE_CHUNK_DATA: 0,
    SIMPLE_APP_MESSAGE_CHUNK_SIZE: 1,
    SIMPLE_APP_MESSAGE_CHUNK_TOTAL: 2
  };
};
