'use strict';
const restOf = require('lodash.tail');
const vm = require('vm');
// str2fn(hapi.methods, 'some.name')(arg1, arg2)
const get = (str, obj, fallback) => {
  if (typeof str === 'function') {
    return str;
  }
  const keys = str.split('.');
  const call = keys.reduce((current, nextKey) => {
    return current ? current[nextKey] : undefined;
  }, obj);
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
const str2fn = (obj, str, fallback) => get(str, obj, fallback);

const execute = (callString, obj, context, executeDone) => {
  const split = callString.split('(');
  const funcName = split[0];
  const paramString = restOf(split).join('(').slice(0, -1);
  context.str2fn = str2fn;
  context.str2fn_executeDone = executeDone;
  context.str2fn_obj = obj;
  const scriptToExecute = `str2fn(str2fn_obj, '${funcName}')(${paramString}, str2fn_executeDone);`;
  vm.runInNewContext(scriptToExecute, context);
};

str2fn.get = get;
str2fn.execute = execute;
module.exports = str2fn;
