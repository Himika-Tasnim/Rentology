const Product = require("../models/product.model.js");

const Booking = require('../models/booking.model.js'); 
const Wishlist = require("../models/wishlist.model.js");
const User = require('../models/userModel');

const nodemailer = require('nodemailer');
require("dotenv").config()


// POST - Create a new product
const createProduct = async (req, res) => {
  try {
    // Log request body for debugging purposes
    console.log('Request body:', req.body);

    // Assign uploaded image filename to req.body.image
    req.body.image = req.file.filename;

    // Ensure availableDate and paymentType are included in the request body
    const { availableDate, paymentType } = req.body;

    if (!availableDate) {
      return res.status(400).json({ message: "Please enter the date when the property will be available" });
    }

    if (!paymentType || !["per night", "per month"].includes(paymentType)) {
      return res.status(400).json({ message: "Please specify a valid payment type (per night or per month)" });
    }

    // Create a new product in the database
    const product = await Product.create(req.body);

    // Send success response with the created product
    res.status(200).json({ message: "Upload Successful", product });
  } catch (error) {
    // Handle errors and send error response
    res.status(500).json({ message: error.message });
  }
};


// GET - Retrieve all products
const getProducts = async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find({});

    // Send products as JSON response
    res.status(200).json(products);
  } catch (error) {
    // Handle errors and send error response
    res.status(500).json({ message: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (transporter, mailOptions) => {
  try {
      await transporter.sendMail(mailOptions);
      console.log('Email has been sent.');
  } catch (error) {
      console.error('Error sending email:', error);
  }
};

const bookProduct = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { id } = req.params;

    // Find the product by its ID
    const product = await Product.findById(id);

    // If product not found, return 404 error
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    // Check if product is available
    if (product.flat <= 0) {
      return res.status(400).json({ message: 'No available flats' });
    }

    // Decrement availability by 1
    product.flat -= 1;

    // Save the updated product back to the database
    await product.save();

    // Create a new booking entry
    const newBooking = new Booking({
      product: product._id,
      user: req.user._id, // Extract user ID from the session
      bookingDate: new Date(),
      paymentType:product.paymentType
    });

    // Save the booking to the database
    await newBooking.save();

    // Fetch user details for sending email
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Set up email options
    const mailOptions = {
      from: {
        name: 'Rentology',
        address: process.env.EMAIL,
      },
      to: user.email,
      subject: 'Booking Confirmation',
      text: `Your booking for ${product.name} has been confirmed successfully.`,
    };

    // Send confirmation email
    await sendMail(transporter, mailOptions);

    // Send the updated product and booking as JSON response
    res.status(200).json({ product, booking: newBooking });

  } catch (error) {
    // Handle errors and send error response
    console.error('Error in bookProduct:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const cancelBooking = async (req, res) => {
  try {
    // Extract booking ID from request parameters
    const { bookingId } = req.params;

    // Find the booking by its ID
    const booking = await Booking.findById(bookingId);

    // If booking not found, return 404 error
    if (!booking) {
      return res.status(404).json({ message: 'Booking Not Found' });
    }

    // Find the associated product
    const product = await Product.findById(booking.product);

    if (!product) {
      return res.status(404).json({ message: 'Associated Product Not Found' });
    }

    // Find the user who made the booking
    const user = await User.findById(booking.user);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Increment availability by 1
    product.flat += 1;

    // Save the updated product back to the database
    await product.save();

    // Set up email options
    const mailOptions = {
      from: {
        name: 'Rentology',
        address: process.env.EMAIL,
      },
      to: user.email,
      subject: 'Booking Cancellation',
      text: `Your booking for ${product.name} has been cancelled.`,
    };

    // Send confirmation email
    await sendMail(transporter, mailOptions);

    // Delete the booking from the database
    await Booking.findByIdAndDelete(bookingId);

    // Send a confirmation response
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    // Handle errors and send error response
    res.status(500).json({ message: error.message });
  }
};



const showBookedProperties = async (req, res) => {
  
  const userId = req.user._id;

    try {
        const bookings = await Booking.find({ user: userId })
            .populate('product') // Populate the product details
            .exec();

        res.status(200).json(bookings); // Send the bookings as JSON response
    } catch (err) {
        console.error('Error retrieving bookings:', err);
        res.status(500).send('Internal Server Error');
    }

};

const addToWishlist = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { id } = req.params;

    // Find the product by its ID
    const product = await Product.findById(id);

    // If product not found, return 404 error
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    // Create a new wishlist entry
    const newWish = new Wishlist({
      product: product._id,
      user: req.user._id, // Extract user ID from the session
    });

    // Save the wishlist entry to the database
    await newWish.save();

    // Send the new wishlist entry as JSON response
    res.status(200).json({ wishlist: newWish });
  } catch (error) {
    // Handle errors and send error response
    res.status(500).json({ message: error.message });
  }
};

const showWishlist = async (req, res) => {
  
  const userId = req.user._id;

    try {
        const wishlist = await Wishlist.find({ user: userId })
            .populate('product') 
            .exec();

        res.status(200).json(wishlist); 
    } catch (err) {
        console.error('Error retrieving wishlist:', err);
        res.status(500).send('Internal Server Error');
    }

};



// Export all controller functions
module.exports = { 
  createProduct,
  getProducts,
  bookProduct,
  addToWishlist,
  showBookedProperties,
  showWishlist,
  cancelBooking,
};
