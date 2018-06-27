const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Seed for the todos database
const todos = [
  { _id: new ObjectID(), text: 'First test todo' },
  { _id: new ObjectID(), text: 'Second test todo' },
  { _id: new ObjectID(), text: 'Third test todo' }
];

console.log("HERE!", todos[0]._id);
console.log("HERE!", todos[1]._id);

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

describe('GET /todos/:id', () => {
  it('should return todo doc for the id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {

    // Generate valid ID, just not in the database
    var validID = new ObjectID();

    request(app)
      .get(`/todos/${validID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });

});
