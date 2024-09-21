const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
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

    availableDate: {
      type: Date,
      required: [true, "Please enter the date when the property will be available"],
    },

    paymentType: {
      type: String,
      enum: ["per night", "per month"],
      required: [true, "Please specify whether the payment is per night or per month"],
    },

    // Reference to the User model
    email: {
      type: String,
      required: true,
      unique: true,
  },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
