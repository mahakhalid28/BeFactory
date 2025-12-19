var express = require('express');
var router = express.Router();
var Product = require('../models/products.js');

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home - Be Factory' });
});

/* GET About Factory page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Our Factory' });
});

/* GET Products page. */
router.get('/products', async function(req, res, next) {
  try {
    let filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    let page=parseInt(req.query.page) || 1;
    let limit=6;
    let skip=(page-1)*limit;

    let totalProducts = await Product.countDocuments(filter);
    let products = await Product.find(filter).skip(skip).limit(limit);
    let totalPages=Math.ceil(totalProducts/limit);

    res.render('products', { 
      title: 'Our Products',
      productsList: products,
      currentPage: page,
      totalPages: totalPages,
      category: req.query.category || "All" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});



/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

/* GET Buy Now page. */
router.get('/buynow', function(req, res, next) {
  res.render('buynow', { title: 'Checkout' });
});

// THIS LINE IS CRITICAL:
module.exports = router;