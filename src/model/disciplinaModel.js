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
      (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

//Função para listar disciplinas
const list = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_disciplina, nome FROM `infocimol`.`disciplina` WHERE ORDER BY id_disciplina DESC = ?;",
      [id],
      (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

//Função para obter disciplina por id
const getById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_disciplina, nome FROM `infocimol`.`disciplina` WHERE id_disciplina = ?;",
      [id],
      (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0]);
        }
      }
    );
  });
};

module.exports = { get, list, getById};
