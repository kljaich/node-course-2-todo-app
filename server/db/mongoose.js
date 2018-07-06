const mongoose = require('mongoose');

// Configure mongoose to use promises instead of callbacks
mongoose.Promise = global.Promise;

// Open and manage database connection
mongoose.connect(process.env.MONGODB_URI);
console.log('Connecting to mongodb:', process.env.MONGODB_URI);

module.exports = { mongoose };
