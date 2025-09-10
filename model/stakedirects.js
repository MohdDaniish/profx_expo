const mongoose = require('mongoose');

// Define a schema
const stakedirectSchema = new mongoose.Schema({
  user: { type: String },
  referrer: { type: String }
},
{ timestamps: true, collection: "stakedirect_4" }
);

// Create a model
const stakedirect = mongoose.model('stakedirect_4', stakedirectSchema);

module.exports = stakedirect;
