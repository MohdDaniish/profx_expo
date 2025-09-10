const mongoose = require('mongoose');

// Define a schema
const stakeRegisterSchema = new mongoose.Schema({
  user: { type: String, maxlength: 200, default: null },
  stake_amount: { type: Number,default : 0 },
  totalIncome: { type: Number,default : 0 },
  totalWithdraw: { type: Number,default : 0 },
  referalIncome: { type: Number,default : 0 },
  levelIncome: { type: Number,default : 0 },
  recurrIncome: { type: Number,default : 0 },
  poolIncome: { type: Number,default : 0 },
  poolbonus: { type: Number,default : 0 },
  currentPool : { type: Number, default : 0},
  wallet_roi: {type: Number, default : 0},
  wallet_referral: {type: Number, default : 0},
  wallet_recurr: {type: Number, default : 0},
  roi_withdraw: {type: Number, default : 0},
  withdraw_endate:{type: Date},
  withdraw_status:{type: Number, default : 0},
  wyz_deposit: { type: Number,default : 0 },
  stusdt_deposit: { type : Number, default : 0},
  directs: { type : Number, default : 0},
  active_directs: { type : Number, default : 0},
  team : { type : Number, default : 0},
  direct_business: { type : Number, default : 0},
  team_business: { type : Number, default : 0},
  rank: { type: String, default : null },
  ranknumber: { type: Number,default : 0 },
},
{ timestamps: true, collection: "stakeRegister_4" }
);

// Create a model
const stakeRegister = mongoose.model('stakeRegister_4', stakeRegisterSchema);

module.exports = stakeRegister;
