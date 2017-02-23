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
  const func = str2fn(obj, funcName);
  const paramString = restOf(split).join('(').slice(0, -1);
  context.str2fn_func = func;
  context.str2fn_executeDone = executeDone;
  context.str2fn_obj = obj;
  const scriptToExecute = `str2fn_func(${paramString}, str2fn_executeDone);`;
  vm.runInNewContext(scriptToExecute, context);
};

const executeOld = (callString, obj, context, executeDone) => {
  const split = callString.split('(');
  const funcName = split[0];
  const func = str2fn(obj, funcName);
  // eval params from param string:
  const paramString = `[${restOf(split).join('(').slice(0, -1)}]`;
  const params = [];
  args.forEach((param) => {
    if (params.type === 'Literal') {
      return params.push(params.value);
    }
    if (params.type === 'Identifier') {
      return params.push(params.name);
    }
    console.log(param)
    // if (params.type === )
  });
  executeDone();
};

str2fn.get = get;
str2fn.execute = execute;
module.exports = str2fn;
