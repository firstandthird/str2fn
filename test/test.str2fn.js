'use strict';
const str2fn = require('../');
const chai = require('chai');

describe('str2fn', () => {
  it('can call a method in an object', (done) => {
    str2fn({
      m1: (p1, p2) => {
        chai.expect(p1).to.equal(1);
        chai.expect(p2).to.equal(2);
        done();
      }
    }, 'm1')(1, 2);
  });
  it('can call a method nested inside an object', (done) => {
    str2fn({
      c1: {
        m1: (p1, p2) => {
          chai.expect(p1).to.equal(1);
          chai.expect(p2).to.equal(2);
          done();
        }
      }
    }, 'c1.m1')(1, 2);
  });
  it('will call a method named by a function', (done) => {
    const dangerous = () => 'm1';
    str2fn({
      m1: (p1, p2) => {
        chai.expect(p1).to.equal(1);
        chai.expect(p2).to.equal(2);
        done();
      }
    }, dangerous)(1, 2);
  });
  it('will call a fallback method if it cannot find it', (done) => {
    str2fn({
      c1: {}
    }, 'c2.m1', (p1, p2) => {
      chai.expect(p1).to.equal(1);
      chai.expect(p2).to.equal(2);
      done();
    })(1, 2);
  });
  it('will throw an error if the fallback method was not provided', (done) => {
    try {
      str2fn({ c1: {} }, 'c2.m1');
    } catch (e) {
      chai.expect(e).to.be.an('error');
      return done();
    }
  });
});
