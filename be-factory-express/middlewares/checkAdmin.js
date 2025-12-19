module.exports = async function (req, res, next) {
    // 1. Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    // 2. Check if the Role is 'admin'
    if (req.session.user.role === 'admin') {
      next(); // Access Granted
    } else {
      // 3. If logged in but NOT admin, kick them out
      console.log("Warning: A non-admin tried to access admin panel!");
      res.redirect('/'); // Send them back to Home Page
    }
  };