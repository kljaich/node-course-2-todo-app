
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) {
    return console.log (`Unable to connect to mongo db server ${err}`);
  }
  console.log ('Connected to mongo db server');

  // create the database - no need for it to exist
  const db = client.db('TodoApp');

  // Insert a record into the User Collection
  db.collection('Todos')
    .find()
    .toArray()
    .then ((docs) => {
      console.log('Todos records');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch documents from Todos')
    });

  db.collection('Todos')
    .find()
    .count()
    .then ((count) => {
      console.log(`Todos count: ${count}`);
    }, (err) => {
      console.log('Unable to count documents from Todos');
    })

  db.collection('Todos')
    .find({completed: false})
    .count()
    .then ((count) => {
      console.log(`Todos count not completed: ${count}`);
    }, (err) => {
      console.log('Unable to count documents from Todos');
    })


  // Need to comment out the following as a Promise (Asynchronous code) is
  // involved.
  // client.close();
})
