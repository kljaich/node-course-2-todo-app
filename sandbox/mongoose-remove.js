const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Remove all the todos, returning object
// Todo.remove({}).then ((res) => {
//   console.log(res);
// });

// Remove one todo, based on filter, and return it
Todo.findOneAndRemove({_id: '5b34cb5f6886152e37e9070c'}).then((todo) => {
  console.log(todo);
});

// Remove one todo, based on id, and return it
Todo.findByIdAndRemove('5b34cb906886152e37e90732').then((todo) => {
  console.log(todo);
});
