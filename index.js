'use strict';

// str2fn(hapi.methods, 'some.name')(arg1, arg2)
const get = (str, obj, fallback) => {
  if (typeof str === 'function') {
    return str;
  }
  const keys = str.split('.');
  const call = keys.reduce((current, nextKey) => {
    return current ? current[nextKey] : undefined
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
str2fn.get = get;
module.exports = str2fn;
