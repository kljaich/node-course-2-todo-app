const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, users, removeTodos, insertTodos, removeUsers, insertUsers} = require('./seed/seed');

// before(() => {
//   console.log('Executing before()');
// })
//
// after(() => {
//   console.log('Executing after()');
// });
//
// beforeEach(() => {
//   console.log('Executing beforeEach()');
// });
//
// afterEach(() => {
//   console.log('Executing afterEach()');
// });

// Done before every test case to remove all Todos and
// then insert them back - mongodb.2.2.19.  For some reason,
// need to remove the Todos before the Users.
beforeEach(removeTodos);
beforeEach(insertTodos);

// Done before evert test case to remove all Users and
// then insert them back - mongodb.2.2.19
beforeEach(removeUsers);
beforeEach(insertUsers);

// Doesn't work if using mongodb.2.2.19 or if using mongdb.2.2.5
// beforeEach ((done) =>  {
//   Todo.remove({}).then(() => {
//     console.log('Got here removed documents');
//     return Todo.insertMany(todos);
//   }).then(() => {
//     console.log ('Got here added documents');
//     done();
//   });
// });

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    this.timeout = 15000;
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      // console.log('Inside .end');
      if (err) return done(err);

      Todo.find({}).then((todos) => {
        // console.log('Inside promise - success');
        expect(todos.length).toBe(3);
        done();
      }).catch((e) => {
        // console.log('Inside .catch()');
        done(e);
      });
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /todos/:id', () => {

  it('should return todo doc for the id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) return done(err)
        done();
      });
  });

  it('should not return todo doc for id created by another user', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('should return 404 if todo not found', (done) => {

    // Generate valid ID, just not in the database
    var validID = new ObjectID();

    request(app)
      .get(`/todos/${validID.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

});


describe('DELETE /todo/:id', () => {

  it('should remove a todo', (done) => {
    var hexID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // Shouldn't find it if it was deleted
        Todo.findById(hexID).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e))
      });
  });

  it('should not remove a todo the user does not own', (done) => {
    var hexID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // Should still find it as it wasn't deleted
        Todo.findById(hexID).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e))
      });
  });

  it('should return 404 for non-existing id', (done) => {
    // Generate valid ID, just not in the database
    var validID = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${validID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
      request(app)
        .delete('/todos/123abc')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
  });

});

describe('PATCH /todo/:id', () => {

  it('should update an id as completed', (done) => {
    var hexID = todos[1]._id.toHexString();
    var myText = 'Second test todo updated';

    request(app)
      .patch(`/todos/${hexID}`)
      .send({text: myText, completed: true})
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(myText);
        // Mine: expect(res.body.completedAt).toBeGreaterThan(0);
        // Mine: expect(res.body.completed).toBeTruthy();
        expect(typeof res.body.completedAt).toBe('number');
        expect(res.body.completed).toBe(true);
      })
      .end(done);
  });

  it('should not update an id as completed if user does not own it', (done) => {
    var hexID = todos[1]._id.toHexString();
    var myText = 'Second test todo updated';

    request(app)
      .patch(`/todos/${hexID}`)
      .send({text: myText, completed: true})
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.text).not.toBe(myText);
        expect(res.body.completedAt).not.toBeDefined();
        expect(res.body.completed).toBeFalsy();
      })
      .end(done);
  });

  it('should reset an id as not completed', (done) => {
    var hexID = todos[2]._id.toHexString();
    var myText = 'Third test todo updated';

    request(app)
      .patch(`/todos/${hexID}`)
      .send({text: myText, completed: false})
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(myText);
        // Mine: expect(res.body.completedAt).toBeNull();
        expect(res.body.completedAt).toBeFalsy();
        // Mine: expect(res.body.completed).toBeFalsy();
        expect(res.body.completed).toBe(false);
      })
     .end(done);
  });
});

describe('GET /user/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end (done);
  })

  it ('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/user/me')
    .expect(401)
    .expect((res) => {
      // Mine: expect(res.body).toMatchObject({});
      expect(res.body).toEqual({});
    })
    .end (done);;
  })

});

describe('POST /user/me', () => {

  it('should create a user', (done) => {
    var email = 'kljaichj@gmail.com';
    var password = 'myPassword';
    request(app)
    .post('/user')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      // Mine: expect(res.headers['x-auth']).toBeDefined();
      expect(res.headers['x-auth']).toBeTruthy();
      // Mine: expect(res.body._id).toBeDefined();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end ((err) => {
      if (err) return(err);

      User.findOne({email}).then((user) => {
        // Mine: expect(user).toBeDefined();
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'kljaich';
    var password = '123abc';
    request(app)
    .post('/user')
    .send({email, password})
    .expect(401)
    .end (done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = users[0].password;
    request(app)
    .post('/user')
    .send({email, password})
    .expect(401)
    .end (done);
  });

});

describe('POST /user/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
    .post('/user/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect ((res) => {
      // Mine: expect(res.headers['x-auth']).toBeDefined();
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) return done(err);
      User.findById(users[1]._id).then((user) => {
        // expect(user.tokens[1]).toHaveProperty('access', 'auth');
        // expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        expect(user.email).toBe(users[1].email);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/user/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        // Mine: expect(res.headers['x-auth']).not.toBeDefined();
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) return done(err);
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);;
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /user/me/token', () => {

  it('should remove auth token on user logout', (done) => {
    request(app)
      .delete('/user/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err,res) => {
        if (err) return done(err);
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
