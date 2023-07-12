const mysql = require("mysql2/promise");

async function connect() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }

  const connection = await mysql.createConnection({
    host: 'mysql.infocimol.com.br',
    user: 'infocimol',
    password: 'c1i2m3o4l5',
    database: 'infocimol',
  });

  console.log("Conectou no MySQL!");

  global.connection = connection;
  return connection;
}

module.exports = { connect };

