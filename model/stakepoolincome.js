const mongoose = require("mongoose");
const { Schema } = mongoose;

const stakePoolIncomeSchema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      pool: { type:  Number,required: true },
      percent: { type:  Number,required: true },
      txn_id: { type:  String,required: true },
      totalBusiness: { type:  Number,required: true },
      send_status:{type:String,default:0},
      lapse_status:{type:String,default:0},
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
const stakepoolincome = mongoose.model("stakePoolIncome", stakePoolIncomeSchema);

module.exports = stakepoolincome;