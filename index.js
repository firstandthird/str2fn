'use strict';
const get = require('lodash.get');

// str2fn(hapi.methods, 'some.name')(arg1, arg2)
const str2fn = (obj, str, fallback) => {
  if (typeof str === 'function') {
    str = str();
  }
  const call = get(obj, str);
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

module.exports = str2fn;
