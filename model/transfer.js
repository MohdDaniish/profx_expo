const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Transfer = mongoose.model("transfer", transferSchema);

module.exports = Transfer;