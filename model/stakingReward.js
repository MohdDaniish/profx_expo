const mongoose = require("mongoose");
const { Schema } = mongoose;

const stakeRewardSchema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      directteam: { type:  Number,required: true },
      directbusiness: { type:  Number,required: true },
      teamsize: { type:  Number,required: true },
      targetbusiness: { type:  Number,required: true },
      seventy : { type:  Number,required: true },
      thirty : { type:  Number,required: true },
      rank: { type:  String,required: true },
      rankno: { type:  Number,required: true },
      send_status:{type:String,default:0},
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
  }
);

// Create indexes for unique fields
// userSchema.index({ mobileNumber: 1, 'documents.pan.number': 1 });
const stakeReward = mongoose.model("stakeReward", stakeRewardSchema);

module.exports = stakeReward;