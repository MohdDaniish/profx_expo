const mongoose = require('mongoose');

// Define a schema
const stakedirectSchema = new mongoose.Schema({
  userId: { type: String },
  referrerId: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a model
const stakedirect = mongoose.model('stakedirect', stakedirectSchema);

module.exports = stakedirect;
