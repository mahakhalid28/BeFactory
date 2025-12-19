var express = require('express');
var router = express.Router();
var Product = require('../models/products.js');
var Order = require('../models/Order'); // <--- CRITICAL: Added Order Model
var checkAdmin = require('../middlewares/checkAdmin');

// Protect all admin routes
router.use(checkAdmin);

/* GET Admin Redirect */
router.get('/', function(req, res, next) {
  res.redirect('/admin/products');
});

/* GET Add Product Page */
router.get('/products/add', async function(req, res, next) {
    res.render('admin/add', { 
        layout: 'admin/layout',  
        title: 'Add New Product' 
    });
});

/* POST Add Product */
router.post('/products/add', async function(req, res, next) {
    try {
        let product = new Product(req.body); 
        await product.save(); 
        res.redirect('/admin/products'); 
    } catch (error) {
        res.send("Error creating product: " + error.message);
    }
});

/* GET Edit Product Page */
router.get('/products/edit/:id', async function(req, res, next) {
    try {
        let product = await Product.findById(req.params.id);
        res.render('admin/edit', { 
            layout: 'admin/layout', 
            title: 'Edit Product',  
            product: product 
        });
    } catch (error) {
        res.send("Error finding product");
    }
});

/* POST Edit Product */
router.post('/products/edit/:id', async function(req, res, next) {
    try {
        let product = await Product.findById(req.params.id);
        
        product.name = req.body.name;
        product.price = req.body.price;
        product.category = req.body.category;
        product.description = req.body.description;
        product.image = req.body.image;
        
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        res.send("Error updating product");
    }
});

/* GET Admin Dashboard (Product List) */
router.get('/products', async function(req, res, next) {
  try {
    const products = await Product.find();
    
    res.render('admin/dashboard', { 
        layout: 'admin/layout', 
        products: products,
        title: 'Admin Dashboard'
    });
  } catch (error) {
    res.send("Error fetching products");
  }
});

/* GET Delete Product */
router.get('/products/delete/:id', async function(req, res, next) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        res.send("Error deleting product");
    }
});

/* ---------------------------------------------------- */
/* NEW: MANAGE ORDERS ROUTES (Added for Lab Final)    */
/* ---------------------------------------------------- */

/* GET Admin Orders List (Fixes the 404 Error) */
router.get('/orders', async function(req, res, next) {
    try {
        // Find all orders, sort by newest date first
        let orders = await Order.find().sort({ createdAt: -1 });
        
        res.render('admin/orders', { 
            layout: 'admin/layout', 
            orders: orders,
            title: 'Manage Orders'
        });
    } catch (error) {
        console.log(error);
        res.redirect('/admin/products');
    }
});

/* POST Update Order Status with Lifecycle Check */
router.post('/orders/update-status', async function(req, res) {
    try {
        let orderId = req.body.orderId;
        let newStatus = req.body.status;
        
        let order = await Order.findById(orderId);
        let currentStatus = order.status;

        // Lifecycle Logic (State Machine)
        let allowed = false;

        if (currentStatus === "Placed" && newStatus === "Processing") allowed = true;
        else if (currentStatus === "Processing" && newStatus === "Delivered") allowed = true;
        else if (newStatus === "Cancelled") allowed = true; // Can cancel anytime

        if (allowed) {
            order.status = newStatus;
            await order.save();
            res.redirect('/admin/orders');
        } else {
            res.send(`INVALID MOVE: Cannot go from ${currentStatus} to ${newStatus}`);
        }

    } catch (error) {
        res.send("Error updating status");
    }
});

module.exports = router;