const mongoose = require('mongoose');

// Define a schema
const stakingPlanSchema = new mongoose.Schema({
  ratio: { type: String, required: true },
  tenure: { type: String, required: true },
  maximumNonWorkingEarning: { type: String, required: true },
  apy: { type: String, required: true },
  maximumWorkingEarning: { type: String, required: true },
  investmentProtocol: { type: String, required: true },
}, { timestamps: true });

// Create a model
const StakingPlan = mongoose.model('stakingUsdt', stakingPlanSchema);

module.exports = StakingPlan;