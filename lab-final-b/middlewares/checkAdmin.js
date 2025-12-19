module.exports = async function (req, res, next) {
    //  Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    //  Check if the Role is 'admin'
    if (req.session.user.role === 'admin') {
      next(); 
    } else {
      //  If logged in but NOT admin
      console.log("Warning: A non-admin tried to access admin panel!");
      res.redirect('/'); 
    }
  };