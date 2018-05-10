
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) {
    return console.log (`Unable to connect to mongo db server ${err}`);
  }
  console.log ('Connected to mongo db server');

  // create the database - no need for it to exist
  const db = client.db('TodoApp');

  // // deleteMany
  // db.collection('Todos')
  //   .deleteMany({name: "Eat lunch"})
  //   .then ((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log('Unable to delete documents from Todos')
  //   });
  //
  // // deleteOne
  // db.collection('Todos')
  //   .deleteOne({name: "Take out the garbage"})
  //   .then ((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log('Unable to delete document from Todos')
  //   });
  // deleteMany

  db.collection('User')
    .deleteMany({name: "Joe Kljaich"})
    .then ((result) => {
      console.log(result);
    }, (err) => {
      console.log('Unable to delete documents from User')
    });

  // deleteOne
  db.collection('User')
    .findOneAndDelete({_id: new ObjectID("5af46f82181a81855259ca6b")})
    .then ((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log('Unable to delete document from User')
    });
  // Need to comment out the following as a Promise (Asynchronous code) is
  // involved.
  // client.close();
})
