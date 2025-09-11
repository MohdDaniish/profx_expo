const mongoose = require('mongoose');

// Define a schema
const stakedirectSchema = new mongoose.Schema({
  user: { type: String },
  referrer: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a model
const stakedirect = mongoose.model('stakedirect', stakedirectSchema);

module.exports = stakedirect;
