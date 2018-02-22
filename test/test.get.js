'use strict';
const str2fn = require('../');
const tap = require('tap');

tap.test('can call a method in an object', (t) => {
  str2fn.get('m1', {
    m1: (p1, p2) => {
      t.equal(p1, 1);
      t.equal(p2, 2);
      t.end();
    }
  })(1, 2);
});

tap.test('can call a method nested inside an object', (t) => {
  str2fn.get('c1.m1', {
    c1: {
      m1: (p1, p2) => {
        t.equal(p1, 1);
        t.equal(p2, 2);
        t.end();
      }
    }
  })(1, 2);
});

tap.test('will call a function if that is passed', (t) => {
  const dangerous = () => 'm1';
  str2fn.get((p1, p2) => {
    t.equal(p1, 1);
    t.equal(p2, 2);
    t.end();
  }, {})(1, 2);
});

tap.test('will call a fallback method if it cannot find it', (t) => {
  str2fn.get('c2.m1', {
    c1: {}
  }, (p1, p2) => {
    t.equal(p1, 1);
    t.equal(p2, 2);
    t.end();
  })(1, 2);
});

tap.test('will just degrade gracefully if fallback is false', (t) => {
  const fn = str2fn.get('c2.m1', { c1: {} }, false);
  t.equal(typeof fn, 'function');
  t.end();
});

tap.test('will throw an error if the fallback method was not provided', (t) => {
  try {
    str2fn.get('c2.m1', { c1: {} });
  } catch (e) {
    t.notEqual(e, null);
    t.end();
  }
});
