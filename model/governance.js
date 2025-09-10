const mongoose = require("mongoose");
const { Schema } = mongoose;

const governanceSchema = new Schema(
  {
      user: { type:  String,required: true },
      targetbusiness: { type:  Number,required: true },
      achievebusiness: { type:  Number,required: true },
      rankno: { type:  Number,required: true },
      send_status:{type:String,default:0},
      date_start:{type:Date},
      date_end:{type:Date},
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
const governance = mongoose.model("governance", governanceSchema);

module.exports = governance;