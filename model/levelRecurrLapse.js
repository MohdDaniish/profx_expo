const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const levelRecurrLapseSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  percent: {
    type: String
  },
  income_status: {
    type: String,
    default: "Credit"
  },
  monthtilljoin: {
    type: Number,
    default: 0
  },
  directs: {
    type: Number,
    default: 0
  },
  reqdirects: {
    type: Number,
    default: 0
  },
  directbiz: {
    type: Number,
    default: 0
  },
  reqbiz: {
    type: Number,
    default: 0
  },
  txHash: {
    type: String
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

const levelRecurrLapse = mongoose.model('levelRecurrLapse', levelRecurrLapseSchema);

module.exports = levelRecurrLapse;
