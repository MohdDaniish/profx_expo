const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const govincomeSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  sender_rank: {
    type: Number,
    default: 0
  },
  receiver_rank: {
    type: Number,
    default: 0
  },
  percent: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const govincome = mongoose.model('govincome', govincomeSchema);

module.exports = govincome;
