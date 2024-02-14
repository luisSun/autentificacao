const express = require('express');
const router = express.Router();
const db = require('../src/db');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  const { email, senha } = req.body;
  if (email && senha) {
    db.query('SELECT * FROM users.usersdb WHERE username = ? AND password_hash = ?', [email, senha], (err, result) => {
      if (err) {
        res.send('Ocorreu um erro ao fazer o login');
      } else {
        if (result.length > 0) {
          const user = result[0];
          req.session.loggedin = true;
          req.session.email = email;
          req.session.tipo_acesso = user.tipo_acesso;
          res.redirect('/');
        } else {
          res.send('Email ou senha incorretos');
        }
      }
    });
  } else {
    res.send('Por favor, informe o email e a senha');
  }
});

module.exports = router;
