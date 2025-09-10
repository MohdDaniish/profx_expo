const mongoose = require("mongoose");
const { Schema } = mongoose;

const wyzconfiigSchema = new Schema(
  {
      lastSyncBlock: { type:  Number,required: true },
      wyz_price: { type:  Number },
      governance_date: { type:  Date },
      rank_income : { type: Number },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
  }
);

const wyzconfiig = mongoose.model("confiig4", wyzconfiigSchema);

module.exports = wyzconfiig;