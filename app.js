const express = require('express');
const session = require('express-session');

const regRouter = require('./routes/register.js');
const loginRouter = require('./routes/login.js');
const dashboardRouter = require('./routes/dashboard.js');
const adminRouter = require('./routes/admin.js');

const app = express();
const PORT = process.env.PORT || 8081;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

function requireAuth(req, res, next) {
  if (req.session && req.session.loggedin) {
    // Se o usuário estiver autenticado, permita o acesso à próxima rota
    return next();
  } else {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    res.redirect('/login');
  }
}

app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', regRouter);
app.use('/', loginRouter);
app.use('/', requireAuth, dashboardRouter);
app.use('/', requireAuth, adminRouter);

app.get('/logout', (req, res) => {
  res.send('<script>alert("Até Mais"); window.location.href = "/login";</script>')
  req.session.destroy();
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
