const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createProduct, getProducts, bookProduct, addToWishlist, showBookedProperties,showWishlist,cancelBooking } = require("../controllers/product.controller");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { protect } = require('../middlewares/authMiddleware');

// Routes
router.post('/', upload.single('product'), createProduct); // Handle product creation with file upload
router.get('/', getProducts); // Get all products
router.put('/book/:id', protect, bookProduct); // Book a specific product by ID
router.put('/wish/:id', protect, addToWishlist); // Add product to wishlist by ID
router.get('/user/:userId/bookings',protect,showBookedProperties)
router.get('/user/:userId/wishlist',protect,showWishlist)
router.delete('/cancel/:bookingId', cancelBooking);


module.exports = router;