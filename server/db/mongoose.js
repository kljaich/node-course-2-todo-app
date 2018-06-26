var mongoose = require('mongoose');

// Configure moongoose to use promises instead of callbacks
mongoose.Promise = global.Promise;

// Open and manage database connection
mongoose.connect('mongodb://localhost:27017/Todo');

module.exports = { mongoose};
