const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Seed for the todos database
const todos = [
  { text: 'First test todo' },
  { text: 'Second test todo' },
  { text: 'Third test todo' }
];

// Done before every test case to remove all elements
beforeEach((done) => {
   Todo.remove({}).then(() => {
     // console.log('GOT HERE');
     done();
   });
});

beforeEach((done) => {
  Todo.insertMany(todos).then(() => {
    // console.log('GOT HERE TOO');
    done();
  });
});

//
// After GET added, need to ensure database starts in
// known state with elements inserted.
// beforeEach ((done) => {
//   Todo.remove({}).then(() => {
//       console.log('Got here one');
//     return Todo.insertMany(todos);
//   }).then(() => {
//     console.log ('Got here new too');
//     done()})
// });

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();

        // Catch for any errors in the call back function
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      };

      Todo.find().then((todos) => {
        expect(todos.length).toBe(3);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});
