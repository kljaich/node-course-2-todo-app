var mongoose = require('mongoose');

// Configure mongoose to use promises instead of callbacks
mongoose.Promise = global.Promise;

// Open and manage database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Todo');

module.exports = { mongoose };
