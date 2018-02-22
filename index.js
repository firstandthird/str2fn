/* eslint-disable no-new-func */

const lookup = function(fnStr, data) {
  return new Function('obj', `
    with(obj) {
      return ${fnStr};
    }
  `)(data);
};

const execute = function(callString, obj, context) {
  const data = Object.assign({}, obj, context);

  return lookup(callString, data);
};

module.exports = execute;
