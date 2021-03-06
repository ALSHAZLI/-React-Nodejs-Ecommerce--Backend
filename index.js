const express = require ('express')
const cors = require('cors')
const app = express();
// using cors to allowd just react app url 
//so i avoid a bug or sercurity issus hear 
// iknow i Know im boss 
app.use(cors());
const mongoose = require ('mongoose')
const dotenv = require ('dotenv')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripCheck = require('./routes/stripe')





dotenv.config();

mongoose.connect(process.env.MONGO_URL).then
(()=>{
    console.log('DBconection success');
}).catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute); 
app.use("/api/carts", cartRoute); 
app.use("/api/orders", orderRoute); 
app.use("/api/checkout",stripCheck)



app.listen((process.env.PORT|| 5000), ()=>{
    console.log('Backend server running on port 5000')
});

