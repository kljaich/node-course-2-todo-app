const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create a new todo
app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    // Better to send an object instead of todos array in case
    // you want to add a property later (more flexible).
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  } )
});

// Get todo by id route
app.get('/todos/:id', (req,res) => {
    // res.send(req.params);
    var id = req.params.id;

    // Verify we have a formated id
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.status(200).send({todo});
      }
    }, (e) => {
      res.status(400).send();
    })
 });

 // Remove todo by id route
 app.delete('/todos/:id', (req,res) => {
     // res.send(req.params);
     var id = req.params.id;

     // Verify we have a well formatted id
     if (!ObjectID.isValid(id)) {
       return res.status(404).send();
     }

     Todo.findByIdAndRemove(id).then((todo) => {
       if (!todo) {
         res.status(404).send();
       } else {
         res.status(200).send({todo});
       }
     }, (e) => {
       res.status(400).send();
     })
  });

// Update todo by id route
app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;

    // Only update these properties.  If user tried to specify others,
    // they will not be picked.
    var body = _.pick(req.body, ['text', 'completed']);

    // Verify we have a well formatted id
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      // Reset the fields
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
      .then((todo) => {
        if (!todo) {
          return res.status(404).send();
        }

        res.status(200).send(todo);
      }).catch((e) => {
        res.status(400).send();
      });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

// Export for testing
module.exports = { app };
