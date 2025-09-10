const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyroi4Schema = new Schema({
  stakeid: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  income_wyz_quantity: {
    type: Number,
    default:0,
  },
  income_stusdt: {
    type: Number,
    default:0,
  },
  rate: {
    type: Number,
    default:0,
  },
  amount: {
    type: Number,
    required: true
  },
  recurr_status: {
    type: Number,
    default : 0
  },
  ratio: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const dailyroi4 = mongoose.model('dailyroi_4', dailyroi4Schema);

module.exports = dailyroi4;
