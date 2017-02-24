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
  it('can execute a method as it might appear in hapi-views, etc', (done) => {
    str2fn.execute(
      "method.name('blah', 'blah2')",
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
        done();
      }
    );
  });
  it('can execute an identifier, a literal, and a member expression', (done) => {
    str2fn.execute(
      "method.name.run('blah', 1, myVal, obj1.obj2.obj3)",
      {
        method: {
          name: {
            run: (stringLiteral, numberLiteral, ref, objRef, methodDone) => {
              chai.expect(stringLiteral).to.equal('blah');
              chai.expect(numberLiteral).to.equal(1);
              chai.expect(ref).to.equal(1);
              chai.expect(objRef).to.equal(22);
              return methodDone(null);
            }
          }
        }
      },
      { myVal: 1, obj1: { obj2: { obj3: 22 } } },
      (err, results) => {
        chai.expect(err).to.equal(null);
        done();
      }
    );
  });
});
