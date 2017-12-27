'use strict';
const str2fn = require('../');
const tap = require('tap');

tap.test('can execute a method in an object', async(t) => {
  const results = str2fn.execute(
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

// tap.test('can handle a missing item in an object', (t) => {
//   const results = str2fn.execute(
//     'users.findOne("test1", age, user.firstName)',
//     {
//       users: {
//         findOne: (name, age, firstName) => {
//           t.equal(firstName, undefined);
//           t.equal(age, 50);
//           return `monkey${age}`;
//         }
//       }
//     },
//     { age: 50 }
//   );
//   t.equal(results, 'monkey50');
//   t.end();
// });

//   tap.test('can return an error for a missing function', (t) => {
//     str2fn.execute(
//       'users.findOne("test1", age, user.firstName)',
//       {},
//       { age: 50 },
//       (err, results) => {
//         chai.expect(err).to.not.equal(null);
//         chai.expect(err.toString()).to.include('findOne does not exist');
//         t.end();
//       }
//     );
//   });
//   tap.test('can execute a method as it might appear in hapi-views, etc', (t) => {
//     str2fn.execute(
//       "method.name('blah', 'blah2')",
//       {
//         method: {
//           name: (var1, var2, methodDone) => {
//             chai.expect(var1).to.equal('blah');
//             chai.expect(var2).to.equal('blah2');
//             methodDone(null, var1 + var2);
//           }
//         }
//       },
//       {},
//       (err, results) => {
//         chai.expect(err).to.equal(null);
//         chai.expect(results).to.equal('blahblah2');
//         t.end();
//       }
//     );
//   });
//   tap.test('can execute an identifier, a literal, and a member expression', (t) => {
//     str2fn.execute(
//       "method.name.run('blah', 1, myVal, obj1.obj2.obj3)",
//       {
//         method: {
//           name: {
//             run: (stringLiteral, numberLiteral, ref, objRef, methodDone) => {
//               chai.expect(stringLiteral).to.equal('blah');
//               chai.expect(numberLiteral).to.equal(1);
//               chai.expect(ref).to.equal(1);
//               chai.expect(objRef).to.equal(22);
//               return methodDone(null);
//             }
//           }
//         }
//       },
//       { myVal: 1, obj1: { obj2: { obj3: 22 } } },
//       (err, results) => {
//         chai.expect(err).to.equal(null);
//         t.end();
//       }
//     );
//   });
// });
