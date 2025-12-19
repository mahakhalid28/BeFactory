var express = require('express');
var router = express.Router();
var Product = require('../models/products.js');
var applyDiscount = require('../middlewares/applyDiscount'); // Import middleware
var Order = require('../models/Order');

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


/*  Add Item to Cart */
router.get('/cart/:id', async function(req, res, next) {
  try {
    let productId = req.params.id;
    let cart = req.session.cart ? req.session.cart : {}; 

    // Find the product from DB
    let product = await Product.findById(productId);
    if (!product) return res.redirect('/products');

    //  If item exists, increase quantity. If not, add it.
    if (cart[productId]) {
      cart[productId].quantity++;
    } else {
      cart[productId] = {
        item: product,
        quantity: 1
      };
    }

    // Save back to session
    req.session.cart = cart;
    console.log("Cart Updated:", cart); 
    
    // Send back to products page
    res.redirect('/products');
    
  } catch (error) {
    console.log(error);
    res.redirect('/products');
  }
});


router.get('/buynow', function(req, res, next) {
  let cart = req.session.cart; // Get cart from session
  
  res.render('buynow', { 
    title: 'Checkout',
    cart: cart // Pass the cart to the view
  });
});
// POST Place Order 
router.post('/place-order', function(req, res, next) {
  //  Clear the session cart
  req.session.cart = null;
  

  res.send(`
    <div style="text-align: center; padding: 50px;">
      <h1>Thank you for your order!</h1>
      <p>Your items will be shipped soon.</p>
      <a href="/products">Continue Shopping</a>
    </div>
  `);
});
router.post('/order/preview', applyDiscount, function(req, res) {
  // Render the preview page with calculations from middleware
  res.render('preview', {
      title: 'Order Preview',
      cart: req.session.cart,
      customerName: req.body.customerName,
      email: req.body.email,
      discount: req.session.discount,
      finalTotal: req.session.finalTotal
  });
});

/* 2. CONFIRM ROUTE (Final Step) */
router.post('/order/confirm', async function(req, res) {
  let cart = req.session.cart;
  let items = [];
  
  // Reconstruct items array
  for (let id in cart) {
      items.push({
          productId: id,
          name: cart[id].item.name,
          price: cart[id].item.price,
          quantity: cart[id].quantity
      });
  }

  // Create Order with "Placed" status
  let order = new Order({
      customerName: req.body.customerName,
      email: req.body.email,
      items: items,
      totalAmount: req.session.finalTotal, // Use the discounted total
      status: "Placed"
  });

  await order.save();
  
  // Clear Session
  req.session.cart = null;
  req.session.discount = null;
  req.session.finalTotal = null;

  res.render('order-confirmation', { title: 'Success', order: order });
});
/* GET My Orders Page */
router.get('/my-orders', async function(req, res) {
  let orders = [];
  let searched = false;

  if (req.query.email) {
      orders = await Order.find({ email: req.query.email });
      searched = true;
  }

  res.render('my-orders', { 
      title: 'My Orders', 
      orders: orders,
      searched: searched 
  });
});



module.exports = router;