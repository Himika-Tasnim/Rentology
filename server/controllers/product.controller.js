const Product = require("../models/product.model.js");
//post 
const createProduct = async(req,res) =>{
  try {
    
    req.body.image = req.file.filename
    const product = await Product.create(req.body);
    res.status(200).json({ message: "Upload Successful" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  }


//get 
const getProducts = async(req,res) =>
  {
   try{
    const product = await Product.find({});
    res.status(200).json(product);
   }
   catch(error){
    res.status(500).json({ message: error.message });
   }
  }



module.exports = { 
  createProduct,
  getProducts,
}