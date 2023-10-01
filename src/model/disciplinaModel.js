const connection = require("./mysqlConnect").query();

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
const list = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id_disciplina, nome FROM `infocimol`.`disciplina` ORDER BY id_disciplina DESC;",
      [id],
      (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const disciplines = rows.map((row) => ({
            value: row.id_disciplina,
            label: row.nome,
          }));
          resolve(disciplines);
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
