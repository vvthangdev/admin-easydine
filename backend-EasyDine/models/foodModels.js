const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isAvaliable: { type: Boolean, default: true },
    star: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);