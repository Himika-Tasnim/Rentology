const Product = require("../models/product.model.js");

// POST
const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);  // Log request body

    req.body.image = req.file.filename;
    const product = await Product.create(req.body);
    res.status(200).json({ message: "Upload Successful", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    console.log(products);  // Corrected this line
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//book
const bookProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    
    // Decrement the availability by 1
    product.flat -= 1;
    
    // Save the updated product
    await product.save();
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createProduct,
  getProducts,
  bookProduct,
};

