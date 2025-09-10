const mongoose = require("mongoose");
const { Schema } = mongoose;

const stakePoolSchema = new Schema(
  {
      user: { type:  String,required: true },
      pool: { type:  Number,required: true },
      seventy : { type:  Number,required: true },
      thirty : { type:  Number,required: true },
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
const stakePool = mongoose.model("stakePool", stakePoolSchema);

module.exports = stakePool;