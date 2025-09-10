const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawalSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  withdrawAmount: {
    type: Number,
    required: true
  },
  wallet_type: {
    type: String,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  recurr_status : {
    type: String,
    default : 0
  },
  isapprove : {
    type: Boolean,
    default : false
  },
  isreject : {
    type: Boolean,
    default : false
  },
  trxnHash : {
    type: String,
    default : null
  },
  isfailed: {
    type: Boolean,
    default : false
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

const WithdrawalModel = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = WithdrawalModel;