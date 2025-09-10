const mongoose = require("mongoose");
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
      deposit : { type:  Number,required: true },
      amount: { type:  Number,required: true },
      protocol: { type:  Number,required: true },
      type: { type:  String }
  },
  { timestamps: true, collection: "clubdeposit" }
);

// Create indexes for unique fields
// userSchema.index({ mobileNumber: 1, 'documents.pan.number': 1 });
const clubdeposit = mongoose.model("clubdeposit", clubSchema);

module.exports = clubdeposit;