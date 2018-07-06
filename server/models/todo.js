var mongoose = require('mongoose');

// var TodoSchema = new mongoose.Schema ({
var Todo = mongoose.model('Todo', {
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    }
});

// var Todo = mongoose.model('Todo', TodoSchema);
module.exports = { Todo };

// Create a new Todo document (not all fields need to be spcified)
// var newToDo = new Todo({
//   text: "cook dinner",
//   completed: true,
//   completedAt:  170388883727
// });

// newToDo.save()
//   .then ((doc) => {
//     console.log(`Saved Todo ${doc}`);
//   }, (err) => {
//     console.log(`Unable to save Todo document ${err}`)
//   });
