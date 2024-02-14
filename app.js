const express = require('express');
const mysql = require('mysql');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao MySQL');
});

app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main', { email: req.session.email });
});

app.get('/login', (req, res) => {
  res.render('login');
});

//Consulta a Tabela usersdb, verifica usuario e Senha e passa o tipo de acesso do usuario
app.post('/login', (req, res) => {
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

//apos logado como user ou admin tem acesso ao Dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.tipo_acesso === 'admin' || req.session.tipo_acesso === 'user') {
      res.render('dashboard', { username: req.session.email });
    } else {
      res.redirect('/login');
    }
  });

//So em acesso a area Admin se o tipo de usuario foir admin
app.get('/admin', (req, res) => {
    if (req.session.loggedin && req.session.tipo_acesso === 'admin') {
      res.render('admin', { username: req.session.email });
    } else {
      res.redirect('/login');
    }
  });
  
//Destroi a Seção
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
