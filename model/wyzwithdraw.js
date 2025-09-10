const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wyzwithdrawalSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  withdrawAmount: {
    type: Number,
    required: true
  },
  wyzrate: {
    type: Number
  },
  withdrawtype: {
    type: String
  },
  trxnHash : {
    type: String,
    default : null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timestamp:{
    type: Date,
    default: Date.now
  }
});

const WyzWithdrawalModel = mongoose.model('WyzWithdrawal', wyzwithdrawalSchema);

module.exports = WyzWithdrawalModel;