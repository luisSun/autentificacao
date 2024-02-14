const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.loggedin && req.session.tipo_acesso === 'admin') {
    res.render('admin', { username: req.session.email });
  } if (req.session.loggedin && req.session.tipo_acesso !== 'admin') {
    res.send('<script>alert("Sem acesso a esse sistema"); window.location.href="/dashboard";</script>');
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
