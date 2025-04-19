const express = require("express")
const app = express();
const dbconnect = require('./config/db.config')
// const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config()
const productRouter = require("./routes/product.routes")
const cartRouter = require("./routes/cart.routes")
const categoryRouter = require("./routes/category.routes")
const subacategoryRouter = require("./routes/subcategory.routes")
const fileUpload = require('express-fileupload');
const UserRegistration = require("./routes/RegistartionRoute");
// app.use(morgan('dev'))
app.use(cors())

dbconnect();


app.use(fileUpload());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/category', categoryRouter)
app.use('/subcategory', subacategoryRouter);
app.use("/user", UserRegistration)

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})