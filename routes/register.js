const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../src/db');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, senha, tipo_acesso } = req.body;
  
  // Verificar se o usuário já existe no banco de dados
  db.query('SELECT * FROM users.usersdb WHERE username = ?', [email], async (err, result) => {
    if (err) {
      return res.send('Ocorreu um erro ao verificar o usuário');
    } else if (result.length > 0) {
      return res.send('<script>alert("Este email já está em uso"); window.location.href = "/register";</script>');
    }

    // Se o usuário não existe, criptografar a senha e inserir no banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10);
    db.query('INSERT INTO users.usersdb (username, password_hash, tipo_acesso) VALUES (?, ?, ?)', [email, hashedPassword, tipo_acesso], (err, result) => {
      if (err) {
        res.send('Ocorreu um erro ao registrar o usuário');
      } else {
        res.send('<script>alert("Usuário registrado com sucesso"); window.location.href = "/login";</script>');
      }
    });
  });
});

module.exports = router;
