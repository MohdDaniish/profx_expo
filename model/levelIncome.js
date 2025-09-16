const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const levelIncomeSchema = new Schema({
  sender: {
    type: String,
    required: true, 

  },
  receiver: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  txHash: { type: String, required: true, },
  block: { type: Number, required: true },
  timestamp: { type: Number, required: true },
});

levelIncomeSchema.index(
  { sender: 1, receiver: 1, txHash: 1 },
  { unique: true }
);

const LevelIncome = mongoose.model('LevelIncome', levelIncomeSchema);

module.exports = LevelIncome;