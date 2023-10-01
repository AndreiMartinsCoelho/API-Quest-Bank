const mysql = require("mysql");
require('dotenv').config();

function query() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }

  const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
  });  

  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}

module.exports = { query };