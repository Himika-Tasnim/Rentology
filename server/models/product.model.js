const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name of the house"],
    },

    flat: {
      type: Number,
      required: true,
      default: 0,
    },

    sqft: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    address: {
      type: String,
      required: [true, "Please enter the address"],
    },
    description: {
      type: String,
    },
    
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;