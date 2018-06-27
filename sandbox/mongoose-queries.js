const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// ID for todos collection
// var id = '5b329a0fd39cae673437bd73';

// ID for users collection
var id = '5b3382c56886152e37e8a2a511';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   // Don't have to make it an object in mongoose
//   _id: id
// }).then ((todos) => {
//   // Works as expected
//   if (todos.length === 0) {
//
//   // Doesn't work when find returns empty array
//   // if (!todos) {
//     return console.log('Todos ID does not exist');
//   }
//   console.log('Todos', todos)
// }).catch ((e) => console.log(e));
//
// Todo.findOne({
//   // Don't have to make it an object in mongoose
//   _id: id
// }).then ((todo) => {
//   if (!todo) {
//     return console.log(`${id} not found`);
//   }
//   console.log('Todo', todo)
// }).catch ((e) => console.log(e));
//
// Todo.findById(id).then ((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch ((e) => console.log(e));

User.findById(id).then ((user) => {
  if (!user) {
    return console.log(`User ${id} not found`);
  }
  console.log('User by ID', JSON.stringify(user, undefined, 2));
}).catch ((e) => console.log(e));

// Another way
User.findById(id).then ((user) => {
  if (!user) {
    return console.log(`User ${id} not found`);
  }
  console.log('User by ID', JSON.stringify(user, undefined, 2));
}, ((e) => console.log(e)));
