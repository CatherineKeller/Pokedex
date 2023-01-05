const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

const { Client } = require('pg');

// const client = new Client(process.env.DATABASE_URL);
const client = new Client();

client.connect();

const sessionMiddleware = expressSession({
  store: new pgSession({
    pool : client,
    tableName : 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //secure: false
  }
});

module.exports = sessionMiddleware;
