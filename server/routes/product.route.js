const express = require('express')
const router = express.Router()
const multer  = require('multer')
const app = express()


const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
const upload = multer({ storage: storage });

const {createProduct,getProducts,bookProduct} = require ("../controllers/product.controller")


router.post('/',upload.single('product'),createProduct)
router.get('/',getProducts)
router.put('/:id',bookProduct)



module.exports= router