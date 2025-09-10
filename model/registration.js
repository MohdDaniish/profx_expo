const mongoose = require("mongoose");
const registration = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    uId: { type: Number, required: true, unique: true },
    user: { type: String, required: true, unique: true },
    referrerId: { type: String, required: true,trim:true },
    rId: { type: Number, required: true },
    referrer: { type: String, required: true },
    rank: { type: Number, default: 0 },
    directCount: { type: Number, default: 0 },
    directStakeCount: { type: Number, default: 0 },
    stakedirectbusiness: { type: Number, default: 0 },
    staketeambusiness: { type: Number, default: 0 },
    directplusteambiz: { type: Number, default: 0 },
    //staketeamCount: { type: Number, default: 0 },
    teamBusiness20level: {type: Number, default:0},
    teamBusiness: {type: Number, default:0},
    monthlyTeamBusiness: {type: Number, default:0},
    previousMonthBusiness:{type:Number,default:0},
    poolLevel:{type: Number, default:0},
    claimedRoi: { type: Number, default: 0 },
    claimed: { type: Number, default: 0 },
    directBonus: { type: Number, default: 0 },
    levelBonus: { type: Number, default: 0 },
    levelStakeBonus: { type: Number, default: 0 },
    poolBonus: { type: Number, default: 0 },
    rankBonus: { type: Number, default: 0 },
    wysStaked: { type: Number, default: 0 },
    wysStaked: { type: Number, default: 0 },
    totalReward:{ type: Number, default: 0 },
    totalLimit:{ type: Number, default: 0 },
    withdrawalReward:{ type: Number, default: 0 },
    availabelReward:{ type: Number, default: 0 },
    lapseReward:{ type: Number, default: 0 },
    monthlyBussiness: {type: Number, default:0 },
    validAtLevelBooster:{type:Number,default:0 },
    exceptAllCondition:{type:Boolean,default:false},
    txHash: { type: String, required: true, unique: true },
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    withdrawStatus: { type: Number, default: 1 },
    borrowAmount:{type:Number, default:0},
    stakingkReward:{type:Number, default:0},
    activatefreeId:{type:Boolean,default:false},
    firstmonthfreeId:{type:Number,default:0},
    freeId:{type:Boolean,default:false},
    cal_status:{type:Number,default:0},
    wyzstakedirectbusiness:{type:Number,default:0},
    teamBusinessnew:{
    type:Number,default:0
    },
    previousMonthStakeBusiness:{
      type:Number,default:0
    }
  },
  { timestamps: true, collection: "registration" }
);

module.exports = mongoose.model("registration", registration);