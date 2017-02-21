'use strict';
const str2fn = require('../');
const chai = require('chai');

describe('str2fn', () => {
  it('can call a method in an object', (done) => {
    str2fn.get('m1', {
      m1: (p1, p2) => {
        chai.expect(p1).to.equal(1);
        chai.expect(p2).to.equal(2);
        done();
      }
    })(1, 2);
  });
  it('can call a method nested inside an object', (done) => {
    str2fn.get('c1.m1', {
      c1: {
        m1: (p1, p2) => {
          chai.expect(p1).to.equal(1);
          chai.expect(p2).to.equal(2);
          done();
        }
      }
    })(1, 2);
  });
  it('will call a function if that is passed', (done) => {
    const dangerous = () => 'm1';
    str2fn.get((p1, p2) => {
      chai.expect(p1).to.equal(1);
      chai.expect(p2).to.equal(2);
      done();
    }, {})(1, 2);
  });
  it('will call a fallback method if it cannot find it', (done) => {
    str2fn.get('c2.m1', {
      c1: {}
    }, (p1, p2) => {
      chai.expect(p1).to.equal(1);
      chai.expect(p2).to.equal(2);
      done();
    })(1, 2);
  });
  it('will throw an error if the fallback method was not provided', (done) => {
    try {
      str2fn.get('c2.m1', { c1: {} });
    } catch (e) {
      chai.expect(e).to.be.an('error');
      return done();
    }
  });
});
