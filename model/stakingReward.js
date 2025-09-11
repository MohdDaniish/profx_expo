const mongoose = require("mongoose");
const { Schema } = mongoose;

const stakeRewardSchema = new Schema(
  {
      user: { type:  String,required: true },
      targetbusiness: { type:  Number,required: true },
      powerleg : { type:  Number,required: true },
      weakleg : { type:  Number,required: true },
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