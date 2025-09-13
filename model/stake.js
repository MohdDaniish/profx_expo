const mongoose = require("mongoose");
const { Schema } = mongoose;

const stake2Schema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      //referral: { type:  String,required: true },
      token: { type:  Number,default : 1 },
      plan : { type: Number, required : true},
      planname : { type: String, required : true},
      stakeType : { type: String, default:null},
      plantype : { type: String, default:null},
      perdayroi: { type: Number,default : 0 },
      permonthroi: { type: Number,default : 0 },
      capping: { type: Number, default: 0},
      cal_status:{type:String,default:0},
      calteam_status:{type:String,default:0},
      level_update:{type:String,default:0},
      regBy:{type:String,default:"Self"},
      incomesent: { type: Number,default:0}, 
      incomesentroi: { type: Number,default:0},
      lockindays: { type: Number,default:0},
      send_status : { type: String,default : 0},
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

// Create indexes for unique fields
// userSchema.index({ mobileNumber: 1, 'documents.pan.number': 1 });
const stake2 = mongoose.model("stake2", stake2Schema);

module.exports = stake2;