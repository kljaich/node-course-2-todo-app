
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) {
    return console.log (`Unable to connect to mongo db server ${err}`);
  }
  console.log ('Connected to mongo db server');

  // create the database - no need for it to exist
  const db = client.db('TodoApp');

  // Update Todos record
  db.collection('Todos')
    .findOneAndUpdate({
      _id: new ObjectID("5af463bd181a81855259c67d")
    }, {
      $set: {
        completed: true
      }
    }, {
      returnOriginal: false
    })
    .then ((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log(`Unable to update document from Todos ${err}`)
    });

  // Update User record
  db.collection('User')
    .findOneAndUpdate({
      name: "Jeff Kljaich"
    }, {
      $set: {
        name: "Jeff J. Kljaich"
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then ((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log(`Unable to update document from User ${err}`)
    });

  // Need to comment out the following as a Promise (Asynchronous code) is
  // involved.
  // client.close();
})
