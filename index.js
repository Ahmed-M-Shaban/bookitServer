// Imports From Packages
const express = require('express');
const mongoose = require('mongoose');
const adminRoute = require('./routes/admin');

// INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://ahmed:2002@cluster0.t0hsp4o.mongodb.net/?retryWrites=true&w=majority";
const DBLOCAL = "mongodb://localhost:27017/Book_It";

// Import From Other Files
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// Middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRoute);
app.use(productRouter);
app.use(userRouter);

//Connnections
mongoose
    .connect(DB)//"mongodb://localhost:27017/Book_It"
    .then(() => {
        console.log('Connection Successful');
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`conected at port ${PORT} `);
})
