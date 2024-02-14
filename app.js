const express = require('express');
const session = require('express-session');
const loginRouter = require('./routes/login.js');
const dashboardRouter = require('./routes/dashboard');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
  res.render('main', { email: req.session.email });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
