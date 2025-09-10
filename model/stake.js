const mongoose = require("mongoose");
const { Schema } = mongoose;

const stake2Schema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      token: { type:  String,required: true },
      ratio: { type:  Number,required: true },
      wyz_amount: {  type:  Number,required: true },
      stusdt_amount: {  type:  Number,required: true },
      wyz_quantity: {  type:  Number,required: true },
      wallet_roi : { type: Number,default : 0 },
      wyz_rate: { type: Number,default : 0 },
      nextWithdrawDate : { type : Date },
      cal_status:{type:String,default:0},
      days_given:{type:Number,default:0},
      roi_given:{type:Number,default:0},
      month_given:{type:Number,default:0},
      txHash: { type:  String,required: true },
      block: { type:  String,required: true },
      timestamp: { type:  String,required: true },
      reg_by: { type:  String,default: "User" },
  },
  { timestamps: true, collection: "stake4" }
);

// Create indexes for unique fields
// userSchema.index({ mobileNumber: 1, 'documents.pan.number': 1 });
const stake2 = mongoose.model("stake4", stake2Schema);

module.exports = stake2;