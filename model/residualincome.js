const mongoose = require("mongoose");
const { Schema } = mongoose;

const residualSchema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      income: { type:  Number,required: true },
      type: { type:  String,required: true },
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
const residual = mongoose.model("residual", residualSchema);

module.exports = residual;