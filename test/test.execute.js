'use strict';
const str2fn = require('../');
const tap = require('tap');

tap.test('can execute a method in an object', async(t) => {
  const results = await str2fn.execute(
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

tap.test('can handle a missing item in an object', async(t) => {
  const results = await str2fn.execute(
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
  t.equal(results, 'monkey50');
  t.end();
});

tap.test('can return an error for a missing function', async(t) => {
  try {
    const results = await str2fn.execute(
      'users.findOne("test1", age, user.firstName)',
      {},
      { age: 50 }
    );
  } catch (err) {
    t.notEqual(err, null);
    t.notEqual(err.toString().indexOf('findOne does not exist'), -1);
    t.end();
  }
});
tap.test('can execute a method as it might appear in hapi-views, etc', async (t) => {
  const results = await str2fn.execute(
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
  await str2fn.execute(
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
    str2fn.execute('string', {}, { context: 1 });
  } catch (e) {
    t.notEqual(e, null);
    t.end();
  }
});

tap.test('callback if not found', (t) => {
  str2fn.execute('string("test")', {}, { context: 1 }, (arg) => {
    t.equals(arg, 'test');
    t.end();
  });
});

tap.test('this', (t) => {
  const thisObj = {
    setThis: true
  };
  str2fn.execute.call(thisObj, 'test()', {
    test() {
      t.deepEquals(this, { setThis: true });
      t.end();
    }
  });
});
