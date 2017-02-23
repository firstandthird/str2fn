'use strict';
const str2fn = require('../');
const chai = require('chai');

describe('str2fn.execute', () => {
  it('can execute a method in an object', (done) => {
    const start = new Date();
    str2fn.execute(
      'users.findOne("test1", age, user.firstName)',
      {
        users: {
          findOne: (name, age, firstName, findDone) => {
            chai.expect(firstName).to.equal('mister');
            chai.expect(age).to.equal(50);
            chai.expect(typeof findDone).to.equal('function');
            findDone(null, `monkey${age}`);
          }
        }
      },
      { age: 50, user: { firstName: 'mister' } },
      (err, results) => {
        chai.expect(err).to.equal(null);
        chai.expect(results).to.equal('monkey50');
        const end = new Date();
        console.log('run time was: %s', end.getTime() - start.getTime())
        done();
      }
    );
  }).timeout(5000);
  it('can execute a method as it might appear in hapi-views, etc', { timeout: 5000 }, (done) => {
    const start = new Date();
    str2fn.execute(
      'method.name("blah", "blah2")',
      {
        method: {
          name: (var1, var2, methodDone) => {
            chai.expect(var1).to.equal('blah');
            chai.expect(var2).to.equal('blah2');
            methodDone(null, var1 + var2);
          }
        }
      },
      {},
      (err, results) => {
        chai.expect(err).to.equal(null);
        chai.expect(results).to.equal('blahblah2');
        const end = new Date();
        console.log('run time was: %s', start.getTime() - end.getTime())
        done();
      }
    );
  }).timeout(5000);
});
