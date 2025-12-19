var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts'); 
var session = require('express-session');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');


var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use express-ejs-layouts (So we don't copy-paste navbar on every page)
app.use(expressLayouts);
app.set('layout', 'layout'); // Defaults to 'views/layout.ejs'

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

// Session Middleware
app.use(session({
  secret: 'secretkey', // In real app, put this in config
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 } 
}));


app.use(function(req, res, next) {
  res.locals.user = req.session.user; 
  next();
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/', usersRouter); 


app.use(function(req, res, next) {
  next(createError(404));
});


// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
  // FIX: We added { title: 'Error' } so the navbar loads correctly
  res.render('error', { title: 'Error Occurred' }); 
});

module.exports = app;