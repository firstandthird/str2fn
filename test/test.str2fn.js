'use strict';
const str2fn = require('../');
const tap = require('tap');

tap.test('can call a method in an object', (t) => {
  str2fn({
    m1: (p1, p2) => {
      t.equal(p1, 1);
      t.equal(p2, 2);
      t.end();
    }
  }, 'm1')(1, 2);
});
tap.test('can call a method nested inside an object', (t) => {
  str2fn({
    c1: {
      m1: (p1, p2) => {
        t.equal(p1, 1);
        t.equal(p2, 2);
        t.end();
      }
    }
  }, 'c1.m1')(1, 2);
});
tap.test('will call a function if that is passed', (t) => {
  const dangerous = () => 'm1';
  str2fn({}, (p1, p2) => {
    t.equal(p1, 1);
    t.equal(p2, 2);
    t.end();
  })(1, 2);
});
tap.test('will call a fallback method if it cannot find it', (t) => {
  str2fn({
    c1: {}
  }, 'c2.m1', (p1, p2) => {
    t.equal(p1, 1);
    t.equal(p2, 2);
    t.end();
  })(1, 2);
});
tap.test('will throw an error if the fallback method was not provided', (t) => {
  t.plan(1);
  try {
    str2fn({ c1: {} }, 'c2.m1');
  } catch (e) {
    t.notEqual(e, null);
    return t.end();
  }
});
