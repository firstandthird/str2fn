'use strict';
const str2fn = require('../');
const chai = require('chai');

describe('str2fn.execute', () => {
  it('can execute a method in an object', (done) => {
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
        done();
      }
    );
  });
});
