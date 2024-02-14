const express = require('express');
const router = express.Router();

// Middleware to protect routes based on user access level
function protectRoute(req, res, next) {
  const isLoggedIn = req.session.user ? true : false;
  if (isLoggedIn) {
    next(); // User is logged in, proceed to the next middleware or route
  } else {
    res.redirect('/login'); // Redirect to login page if not logged in
  }
}

router.get('/dashboard', (req, res) => {
  if (req.session.tipo_acesso === 'admin' || req.session.tipo_acesso === 'user') {
    res.render('dashboard', { username: req.session.email });
  } else {
    return res.send('<script>alert("Sem permissão de acessar este item"); window.location.href = "/";</script>');
  }
});

module.exports = router;
