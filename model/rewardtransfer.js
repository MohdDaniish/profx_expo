const mongoose = require("mongoose");

const rewardtransfer = mongoose.Schema(
  {
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    return: { type: Number, required: true },
    totalIncome:{type:Number,required:true},
    rewardBalance:{type:Number,required:true},
    createdAt: {
        type: Date,
        default: Date.now,
      },
  }
);

module.exports = mongoose.model("rewardtransfer", rewardtransfer);