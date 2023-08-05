const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para buscar todas as disciplinas
const get = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_disciplina, nome FROM `infocimol`.`disciplina`;",
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Função para listar disciplinas
const list = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_disciplina, nome FROM `infocimol`.`disciplina` WHERE id_disciplina = ?;",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = { get, list };
