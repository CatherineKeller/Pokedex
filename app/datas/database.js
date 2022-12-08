const { Client } = require('pg');

const connectionString = process.env.PG_CONNECT;

const client = new Client({
  connectionString,
});

client.connect();

module.exports = client;
