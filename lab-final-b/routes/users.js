var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcryptjs');

/*  REGISTER ROUTES */
router.get('/register', function(req, res) {
  res.render('users/register', { title: 'Register' });
});

/* POST Register Logic  */
router.post('/register', async function(req, res) {
  let user = new User(req.body);

 

  user.password = await user.generateHash(req.body.password);
  await user.save();
  res.redirect('/login');
});
/* 2. LOGIN ROUTES */
router.get('/login', function(req, res) {
  res.render('users/login', { title: 'Login' });
});


router.post('/login', async function(req, res) {
  let user = await User.findOne({ email: req.body.email });
  
  if (!user) return res.redirect('/login'); 
  
  let isValid = await user.validPassword(req.body.password);
  if (!isValid) return res.redirect('/login'); 

  req.session.user = user;
  
  if(user.role === 'admin') {
      res.redirect('/admin/products');
  } else {
      res.redirect('/');
  }
});

/*  LOGOUT ROUTE */
router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/login');
});

module.exports = router;