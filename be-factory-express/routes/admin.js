var express = require('express');
var router = express.Router();
var Product = require('../models/products.js');

router.get('/', function(req, res, next) {
  res.redirect('/admin/products');
});

// add new product page
router.get('/products/add', async function(req, res, next) {
    res.render('admin/add', { 
        layout: 'admin/layout',  
        title: 'Add New Product' 
    });
});
router.post('/products/add', async function(req, res, next) {
    try {
        let product = new Product(req.body); 
        await product.save(); 
        res.redirect('/admin/products'); 
    } catch (error) {
        res.send("Error creating product: " + error.message);
    }
});
// update  product page
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
    // NOTICE: We explicitly tell it to use the 'admin/layout' here!
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

module.exports = router;