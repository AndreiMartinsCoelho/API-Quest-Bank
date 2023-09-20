const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

//Função para criar uma prova
const criar = (novaProva) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(
        `INSERT INTO infocimol.prova (descricao, formato, tipo, professor_pessoa_id_pessoa, enunciado)
        VALUES (?, ?, ?, ?, ?);`,
        [
          novaProva.descricao,
          novaProva.formato,
          novaProva.tipo,
          novaProva.professorId,
          novaProva.enunciado,
        ],
        async (error, result) => {
          if (error) {
            connection.rollback(() => reject(error));
          } else {
            const novaProvaId = result.insertId;

            try {
              await inserirQuestoes(novaProvaId, novaProva.questoes);
              connection.commit(() => {
                connection.query(
                  `SELECT * FROM infocimol.prova WHERE id_prova = ?;`,
                  [novaProvaId],
                  async (error, results) => {
                    if (error) {
                      reject(error);
                    } else {
                      const provaDetalhes = results[0];
                      const questoes = await getQuestoes(novaProvaId);
                      resolve({ novaProvaId, provaDetalhes, questoes });
                    }
                  }
                );
              });
            } catch (error) {
              connection.rollback(() => reject(error));
            }
          }
        }
      );
    });
  });
};

//Função para obter as prova
const listar = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.formato, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
       FROM infocimol.prova p
       JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
       JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
       ORDER BY p.id_prova DESC`,
      [id],
      async (error, results) => {
        if (error) {
          reject(error);
        } else {
          const provas = await Promise.all(
            results.map(async (prova) => {
              const questoes = await getQuestoes(prova.id_prova);
              return {
                id_prova: prova.id_prova,
                enunciado: prova.enunciado,
                formato: prova.formato,
                tipo: prova.tipo,
                criado_por: {
                  professor_pessoa_id_pessoa: prova.professor_pessoa_id_pessoa,
                  professor_nome: prova.professor_nome,
                },
                descricao: prova.descricao,
                questoes: questoes,
              };
            })
          );
          resolve(provas);
        }
      }
    );
  });
};

//Função para obter as questões de uma prova
const getQuestoes = (provaId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.enunciado AS questao_enunciado
        FROM infocimol.questao_prova qp
        JOIN questao q ON qp.questao_id_questao = q.id_questao
        WHERE qp.prova_id_prova = ?;`,
      [provaId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const questoes = results.map((questao) => questao.questao_enunciado);
          resolve(questoes);
        }
      }
    );
  });
};

//Função para inserir as questões de uma prova
const inserirQuestoes = (provaId, questoes) => {
  return new Promise((resolve, reject) => {
    const values = questoes.map((questaoId) => [questaoId, provaId]);
    const insertQuery = `
      INSERT INTO infocimol.questao_prova (questao_id_questao, prova_id_prova)
      VALUES ?;
    `;

    connection.query(insertQuery, [values], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

//Função para obter as provas
const get = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.formato, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
        FROM infocimol.prova p
        JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
        JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
        ORDER BY p.id_prova DESC`,
      async (error, results) => {
        if (error) {
          reject(error);
        } else {
          const provas = await Promise.all(
            results.map(async (prova) => {
              const questoes = await getQuestoes(prova.id_prova);
              return {
                id_prova: prova.id_prova,
                enunciado: prova.enunciado,
                formato: prova.formato,
                tipo: prova.tipo,
                criado_por: {
                  professor_pessoa_id_pessoa: prova.professor_pessoa_id_pessoa,
                  professor_nome: prova.professor_nome,
                },
                descricao: prova.descricao,
                questoes: questoes,
              };
            })
          );
          resolve(provas);
        }
      }
    );
  });
};

module.exports = { get, criar, listar, getQuestoes, inserirQuestoes };
