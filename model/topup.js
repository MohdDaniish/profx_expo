const mongoose = require("mongoose");
const { Schema } = mongoose;

const topupnewSchema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      plan: { type:  String,required: true },
      protocol: { type:  String,required: true },
      calteam_status:{type:String,default:0},
      cal_status:{type:String,default:0},
      perdayroi: { type: Number,default : 0 },
      txHash: { type:  String,required: true },
      block: { type:  String,required: true },
      timestamp: { type:  String,required: true },
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
const topup2 = mongoose.model("topup2", topupnewSchema);

module.exports = topup2;