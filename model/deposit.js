const mongoose = require("mongoose");
const { Schema } = mongoose;

const depositSchema = new Schema(
  {
      user: { type:  String,required: true },
      userId: { type:  String,required: true },
      amount: { type:  Number,required: true },
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

depositSchema.index(
  { user: 1, amount: 1, txHash: 1 },
  { unique: true }
);

const deposit = mongoose.model("deposit", depositSchema);

module.exports = deposit;