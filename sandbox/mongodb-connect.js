
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) {
    return console.log (`Unable to connect to mongo db server ${err}`);
  }
  console.log ('Connected to mongo db server');

  // create the database - no need for it to exist
  const db = client.db('TodoApp');

  // Insert a record into the Todos Collection
  // db.collection('Todos').insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log (`Unable to insert record in Todos ${err}`);
  //   }
  //   console.log (JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert a record into the User Collection
  db.collection('User').insertOne({
    name: "Joe Kljaich",
    age: 59,
    location: "Naperville"
  }, (err, result) => {
    if (err) {
      return console.log (`Unable to insert record in User ${err}`);
    }
    console.log (JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
})
