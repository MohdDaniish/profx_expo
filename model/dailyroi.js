const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyroiSchema = new Schema({
  stakeid: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  ratio: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  income_status: {
    type: String,
    default: "Credit"
  },
  totalIncome: {
    type: Number
  },
  capping: {
    type: Number
  },
  recurr_status : {
    type: String,
    default : 0
  },
  txHash: { type:  String,required: true },
  insertedAt: {
    type: Date,
    default: () => moment().utcOffset('+05:30').format()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const dailyroi = mongoose.model('dailyroiWYZ', dailyroiSchema);

module.exports = dailyroi;
