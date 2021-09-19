const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors');


//importing routes
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const categoryRoutes = require("./routers/category");
const productRoutes = require("./routers/product");


//port defination
const port = process.env.PORT || 8000;

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(() =>{
    console.log('DATABASE CONNECTED')
}).catch((err) =>{
    console.log(`DATABASE CONNECTION  ERROR ${err}`)
})

//Predefine Middle ware 
app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(cors());

//Express Routing
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);



// server start here
app.listen(port, () => {
    console.log(`server is running at the port no  ==> ${port}`)
}) 