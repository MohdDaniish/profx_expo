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
  directs: {
    type: Number,
    default: 0
  },
  directbiz: {
    type: Number,
    default: 0
  },
  ranknumber: {
    type: Number,
    default: 0
  },
  prev_biz : {
    type: Number,
    default : 0
  },
  carry_forward : {
    type: Number,
    default : 0
  },
  day_past : {
    type: Number,
    default : 0
  },
  month_past : {
    type: Number,
    default : 0
  },
  date_start : {
    type: Date
  },
  date_end : {
    type: Date
  },
  prev_start : {
    type: Date
  },
  prev_end : {
    type: Date
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
