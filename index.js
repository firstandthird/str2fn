'use strict';
const restOf = require('lodash.tail');
const jsep = require('jsep');
const getValue = require('lodash.get');

// str2fn(hapi.methods, 'some.name')(arg1, arg2)
const get = function(str, obj, fallback) {
  if (typeof str === 'function') {
    return str;
  }
  const keys = str.split('.');
  const call = keys.reduce((current, nextKey) => (current ? current[nextKey] : undefined), obj);
  if (call) {
    return call;
  }
  if (fallback) {
    return fallback;
  }
  if (fallback === false) {
    return () => {};
  }
  throw new Error(`Method ${str} does not exist`);
};

const execute = function(callString, obj, context, fallback) {
  const getExpression = (param) => {
    if (param.type === 'MemberExpression') {
      return `${getExpression(param.object)}.${param.property.name}`;
    }
    if (param.type === 'Literal') {
      return param.value;
    }
    return param.name;
  };
  const split = callString.split('(');
  const funcName = split[0];
  const func = get(funcName, obj, fallback);
  // eval params from param string:
  const paramString = `[${restOf(split).join('(').slice(0, -1)}]`;
  const parsedArgs = jsep(paramString);
  const params = [];
  parsedArgs.elements.forEach((param) => {
    if (param.type === 'Identifier') {
      return params.push(getValue(context, param.name));
    }
    if (param.type === 'MemberExpression') {
      return params.push(getValue(context, getExpression(param)));
    }
    params.push(getExpression(param));
  });
  return func.apply(this, params);
};

module.exports = { execute, get };
