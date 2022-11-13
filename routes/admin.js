const express = require("express");
const adminRoute = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const multer = require("multer");
const path = require("path");
const { db } = require("../models/product");
const Order = require("../models/order");

// var storage = multer.diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//         cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })
// var upload = multer({
//     storage: storage,
// }).single("images");

//Add Product
adminRoute.post("/admin/add-product", admin, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;

        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });

        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Get All Products
adminRoute.get("/admin/get-products", admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Delete The Product
adminRoute.post("/admin/delete-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Get All Orders
adminRoute.get("/admin/get-orders", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Change The Order Status
adminRoute.post("/admin/change-order-status", admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Analitics
adminRoute.get("/admin/analytics", admin, async (req, res) => {
    
        // const orders = await Order.find({});
        // let totalEarnings = 0;

        try {

        // for (let i = 0; i < orders.length; i++) {
        //     for (let j = 0; i < orders[i].products.length; j++) {
        //         totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
        //     }
        // }

        const orders =await Order.find({});
        let totalEarnings =0;
        for(let i=0;i<orders.length;i++){
            for(let j=0;j<orders[i].products.length;j++){
                totalEarnings+=orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }
        try {
        // Category Wise Order Fetching
        let novelAndStoriesEarnings = await fetchCategoryWiseProduct("Novels and stories");
        let literatureAndBooksEarnings = await fetchCategoryWiseProduct("literature books");
        let historicalBooksEarnings = await fetchCategoryWiseProduct("Historical books");
        let politicalBooksEarnings = await fetchCategoryWiseProduct("political books");
        let scientificBooksEarnings = await fetchCategoryWiseProduct("scientific books");

        let earnings = {
            totalEarnings, 
            novelAndStoriesEarnings, 
            literatureAndBooksEarnings, 
            historicalBooksEarnings, 
            politicalBooksEarnings, 
            scientificBooksEarnings,
        };
    

        res.json(earnings);

    } catch (e) {
        res.status(500).json({ error: "e.message hello ahmed" });
    }

    } catch (e) {
        res.status(500).json({ error: "e.message hello" });
    }
});

async function fetchCategoryWiseProduct(category) {      // const fetchCategoryWiseProduct = async (category) => {
    let earnings = 0;
    let categoryOrders = await Order.find({
        'products.product.category': category,
    });

    for (let i = 0; i < categoryOrders.length; i++) {
        for (let j = 0; j < categoryOrders[i].products.length; j++) {
            earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price ;
        }
    }
    return earnings;
}

module.exports = adminRoute;
