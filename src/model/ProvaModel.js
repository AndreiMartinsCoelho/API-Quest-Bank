const connection = require("./mysqlConnect").query();

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
          const questoes = results.map((questao, ) => 
            questao.questao_enunciado
          );
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

//Função para editar uma prova
const editarProva = (enunciado, descricao, tipo, idProva) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE prova SET descricao = ?, tipo = ?, enunciado = ? WHERE id_prova = ?`,
      [
        descricao,
        tipo,
        enunciado,
        idProva,
      ],
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

//Função para excluir prova
const excluirProva = (idProva) =>{
    return new Promise((resolve, reject) => {
        connection.query(
        `DELETE FROM prova WHERE id_prova = ?`,
        [idProva],
            (error, results) => {
                if (error) {
                reject(error);
                } else {
                resolve(results);
                }
            }
        );
    });
}

//Função para obter uma prova específico pelo seu ID
const obterProvaPorId = async (idProva) => {
    try {
        const resultados = await new Promise((resolve, reject) => {
            connection.query(
            `SELECT p.id_prova, p.descricao, p.formato, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
            FROM infocimol.prova p
            JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
            JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
            WHERE p.id_prova = ?`,
            [idProva],
            (error, resultados) => {
                if (error) {
                resolve(null); // Retorna null em caso de erro
                } else {
                resolve(resultados);
                }
            }
            );
        });
        const questoes = await getQuestoes(idProva);
        const prova = resultados.map((prova) => ({
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
        }));
    
        return prova;
    } catch (error) {
        return null; // Retorna null em caso de erro
    }
};
module.exports = {
  get,
  criar,
  listar,
  getQuestoes,
  inserirQuestoes,
  editarProva,
  excluirProva,
  obterProvaPorId,
};
