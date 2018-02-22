'use strict';
const str2fn = require('../');
const tap = require('tap');
//tap.runOnly = true;

tap.test('can execute a method in an object', async(t) => {
  const results = await str2fn(
    'users.findOne("test1", age, user.firstName)',
    {
      users: {
        findOne: (name, age, firstName) => {
          t.equal(firstName, 'mister');
          t.equal(age, 50);
          return `monkey${age}`;
        }
      }
    },
    { age: 50, user: { firstName: 'mister' } }
  );
  t.equal(results, 'monkey50');
  t.end();
});

tap.test('can concat strings', async(t) => {
  const results = await str2fn(
    'getName(`${firstName} ${lastName}`, age)',
    {
      getName: (name, age) => `${name} ${age}`
    },
    { firstName: 'James', lastName: 'Smith', age: 12 }
  );
  t.equal(results, 'James Smith 12');
  t.end();
});

tap.test('throws if a missing item in an object', async(t) => {
  try {
    await str2fn(
      'users.findOne("test1", age, user.firstName)',
      {
        users: {
          findOne: (name, age, firstName) => {
            t.equal(firstName, undefined);
            t.equal(age, 50);
            return `monkey${age}`;
          }
        }
      },
      { age: 50 }
    );
  } catch (e) {
    t.equals(e.message, 'user is not defined');
    t.end();
  }
});

tap.test('can return an error for a missing function', async(t) => {
  try {
    await str2fn(
      'users.findOne("test1", age, user.firstName)',
      {},
      { age: 50 }
    );
  } catch (err) {
    t.notEqual(err, null);
    t.equal(err.message, 'users is not defined');
    t.end();
  }
});
tap.test('can execute a method as it might appear in hapi-views, etc', async (t) => {
  const results = await str2fn(
    "method.name('blah', 'blah2')",
    {
      method: {
        name: (var1, var2) => {
          t.equal(var1, 'blah');
          t.equal(var2, 'blah2');
          return var1 + var2;
        }
      }
    },
    {}
  );
  t.equal(results, 'blahblah2');
  t.end();
});

tap.test('can execute an identifier, a literal, and a member expression', async(t) => {
  await str2fn(
    "method.name.run('blah', 1, myVal, obj1.obj2.obj3)",
    {
      method: {
        name: {
          run: (stringLiteral, numberLiteral, ref, objRef) => {
            t.equal(stringLiteral, 'blah');
            t.equal(numberLiteral, 1);
            t.equal(ref, 1);
            t.equal(objRef, 22);
            return null;
          }
        }
      }
    },
    { myVal: 1, obj1: { obj2: { obj3: 22 } } }
  );
  t.end();
});

tap.test('throws if fn not found', (t) => {
  try {
    str2fn('string', {}, { context: 1 });
  } catch (e) {
    t.notEqual(e, null);
    t.end();
  }
});

//TODO: decide if we still want to support this
tap.skip('this', (t) => {
  const thisObj = {
    setThis: true
  };
  str2fn.call(thisObj, 'test()', {
    test() {
      t.deepEquals(this, { setThis: true });
      t.end();
    }
  });
});
