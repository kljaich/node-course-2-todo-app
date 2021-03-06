const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// Seed for the todos collection
const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    completed: false,
    _creator: userTwoId
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: false,
    _creator: userOneId
  }, {
    _id: new ObjectID(),
    text: 'Third test todo',
    completed: true,
    completedAt:123456,
    _creator: userOneId
  }
];

// Seed for the users collection
const users = [
  {
    _id: userOneId,
    email: 'kljaich@gmail.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }, {
    _id: userTwoId,
    email: 'jkljaich@gmail.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
]

// console.log("HERE!", todos[0]._id);
// console.log("HERE!", todos[1]._id);
// console.log("HERE!", todos[2]._id);

const removeTodos = ((done) => {
  // console.log("Before removing Todos");
  Todo.remove({}).then(() => {
    // console.log('Removed all the Todos');
    done();
  });
});

const insertTodos = ((done) => {
  // console.log("Before inserting Todos");
  Todo.insertMany(todos).then(() => {
    // console.log('Inserted all the Todos');
    done();
  });
});

const removeUsers = ((done) => {
  // console.log('Before removing Users');

  // The following works:
  // User.remove({}).then(() => {
  //   console.log('Removed all the Users');
  //   done();
  // });

  // And the following works as well.
  var userOne = User.remove({});
  Promise.all([userOne]).then (() => {
    // console.log('Removed all the Users');
    done();
  });
});

const insertUsers = ((done) => {
  // console.log('Before inserting Users');

  // Need to call the middleware to hash the
  // password.  UserOne and UserTwo are promises.
  var userOne = new User(users[0]).save();
  var userTwo = new User(users[1]).save();

  // Utility that waits for all promises is the arrar
  Promise.all([userOne, userTwo]).then (() => {
    // console.log('Inserted all the Users');
    done();
  });
});

module.exports = {
  todos,
  users,
  removeTodos,
  insertTodos,
  removeUsers,
  insertUsers
};
