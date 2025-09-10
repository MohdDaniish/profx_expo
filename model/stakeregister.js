const mongoose = require('mongoose');

// Define a schema
const stakeRegisterSchema = new mongoose.Schema({
  user: { type: String, maxlength: 200, default: null },
  //referral: { type:  String,required: true },
  return: { type: Number,default : 0 },
  stake_amount: { type: Number,default : 0 },
  topup_amount: { type: Number,default : 0 },
  totalIncome: { type: Number,default : 0 },
  totalWithdraw: { type: Number,default : 0 },
  lapseIncome: { type: Number,default : 0 },
  referalIncome: { type: Number,default : 0 },
  levelIncome: { type: Number,default : 0 },
  recurrIncome: { type: Number,default : 0 },
  poolIncome: { type: Number,default : 0 },
  rank: { type: String, default : null },
  ranknumber: { type: Number,default : 0 },
  rankbonus: { type: Number,default : 0 },
  poolbonus: { type: Number,default : 0 },
  currentPool : { type: Number, default : 0},
  rankboosterlevel: { type: Number,default : 0 },
  wallet_roi: {type: Number, default : 0},
  wallet_referral: {type: Number, default : 0},
  wallet_rewards: {type: Number, default : 0},
  wallet_recurr: {type: Number, default : 0},
  wallet_tank: {type: Number, default : 0},
  wallet_credit: {type: Number, default : 0},
  roi_withdraw: {type: Number, default : 0},
  withdraw_stdate:{type: Date},
  withdraw_endate:{type: Date},
  withdrawref_stdate:{type: Date},
  withdrawref_endate:{type: Date},
  withdraw_status:{type: Number, default : 0},
  openlevel: {type: Number, default : 0},
  
  wyz_stake_amount_usdt: { type: Number,default : 0 },
  wyz_topup_amount_usdt: { type : Number, default : 0},
  wyz_stake_amount: { type: Number,default : 0 },
  wyz_topup_amount: { type : Number, default : 0},
  wyz_totalIncome: { type: Number,default : 0 },
  wyz_totalWithdraw: { type: Number,default : 0 },
  wyz_total_recurr: { type: Number,default : 0 },
  wyz_return: { type: Number,default : 0 },
  wyz_referalIncome: { type: Number,default : 0 },
  wyz_levelIncome: { type: Number,default : 0 },
  wyz_recurrIncome: { type: Number,default : 0 },
  wyz_wallet_income: {type: Number, default : 0},
  wyz_roi_income: {type: Number, default : 0},
  wyz_wallet_tank: {type: Number, default : 0},
  governance_wallet: {type: Number, default : 0},
  governance_income: {type: Number, default : 0},
  wyz_withdraw_endate:{type: Date},

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a model
const stakeRegister = mongoose.model('stakeRegister', stakeRegisterSchema);

module.exports = stakeRegister;
