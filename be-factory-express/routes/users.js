var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcryptjs');

/* 1. REGISTER ROUTES */
router.get('/register', function(req, res) {
  res.render('users/register', { title: 'Register' });
});

/* POST Register Logic (Secure - Only for Normal Users) */
router.post('/register', async function(req, res) {
  let user = new User(req.body);

  // NOTE: Humne woh logic hata di hai jo admin banati thi.
  // Ab user.role automatically default "user" hoga.

  user.password = await user.generateHash(req.body.password);
  await user.save();
  res.redirect('/login');
});
/* 2. LOGIN ROUTES */
router.get('/login', function(req, res) {
  res.render('users/login', { title: 'Login' });
});

// THIS is the route that was likely missing or causing the 404
router.post('/login', async function(req, res) {
  let user = await User.findOne({ email: req.body.email });
  
  if (!user) return res.redirect('/login'); // User not found
  
  let isValid = await user.validPassword(req.body.password);
  if (!isValid) return res.redirect('/login'); // Wrong password

  req.session.user = user;
  
  if(user.role === 'admin') {
      res.redirect('/admin/products');
  } else {
      res.redirect('/');
  }
});

/* 3. LOGOUT ROUTE */
router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/login');
});

module.exports = router;