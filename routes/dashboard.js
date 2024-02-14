const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.loggedin && (req.session.tipo_acesso === 'admin' || req.session.tipo_acesso === 'user')) {
    res.render('dashboard', { username: req.session.email });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
