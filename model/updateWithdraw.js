const mongoose = require("mongoose");

const UpdateWithdraw = mongoose.Schema(
  {
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    wallet_type: { type: String, required: true },
    action:{type:String,required:true ,default:""}
  },
  { timestamps: true, collection: "updateWithdraw" }
);

module.exports = mongoose.model("updateWithdraw", UpdateWithdraw);
