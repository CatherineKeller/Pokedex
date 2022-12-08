require('dotenv').config(); // variables d'environnement
const express = require('express'); // express
const router = require('./app/router'); // router
const expressSession = require('express-session'); // session

const app = express();
const PORT = process.env.PORT || 3000;

// Templates
app.set('views', './app/views');
app.set('view engine', 'ejs');

// Public
app.use(express.static('./public'));

// Session
app.use(expressSession({
  secret: 'pokedex',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}));

// Routage
app.use(router);

// 404
app.use((req,res)=>{
  res.status(404).render('main/notFound');
});

app.listen(PORT, () => {
  console.log('App listening on port http://localhost:PORT');
});
