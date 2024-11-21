const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  Image: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Product = model("product", productSchema);

module.exports = Product;
