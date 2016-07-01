var simpleAppMessage = require('../index');
var testData = {
  keyNull: null,
  keyBool: true,
  keyInt: 257,
  keyData: [1, 2, 3, 4],
  keyString: 'test'
};

simpleAppMessage.send(testData);
