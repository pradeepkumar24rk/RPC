const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WishList = new Schema({
  customerId: { type: String },
  products: [
    {
      _id: { type: String, require: true },
    },
  ],
});

module.exports = mongoose.model("wishList", WishList);
