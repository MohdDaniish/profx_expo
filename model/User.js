const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    mobile: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Mobile number must be 10 digits",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    referral: {
      type: String,
    },
    address: { type: String, default: null},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);