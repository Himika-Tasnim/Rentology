//set up framework

const express = require('express')
const app = express()
const PORT = 5000;

const cors = require('cors');
app.use(cors());

//middleware
app.use(express.json()) //to read json
app.use(express.urlencoded({extended:false})) // to read form & other formats



//routes
const productRoute = require("./routes/product.route.js")
app.use("/api/products",productRoute)


app.listen(PORT,()=>{
  console.log("Running")
})

app.get("/", async(req,res) => {
  res.send("Hello from Himika")
})


//for mogngodb
const mongoose = require('mongoose')
mongoose.connect('mongodb://himikatasnim:u2WLsD9CXpz1ylK2@ac-lfhemwb-shard-00-00.u1yn5px.mongodb.net:27017,ac-lfhemwb-shard-00-01.u1yn5px.mongodb.net:27017,ac-lfhemwb-shard-00-02.u1yn5px.mongodb.net:27017/?replicaSet=atlas-374oza-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
  console.log('Connected!')
  })
  .catch((error) => {
  console.log(error)
  console.log ('Not connected')
  })



// tahsin
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
dotenv.config();

app.use('/api/auth', userRoutes);

const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);
