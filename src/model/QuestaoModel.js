const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para obter todas as questões
const get = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, q.topico_id_topico, t.enunciado AS topico_enunciado, q.tipo, q.nivel, q.Enunciado_imagem, q.resposta, p.nome AS professor_nome, q.professor_pessoa_id_pessoa,
          a.id_alternativa, a.correta, a.enunciado AS alternativa_enunciado
          FROM infocimol.questao q
          JOIN topico t ON q.topico_id_topico = t.id_topico
          JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
          JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
          LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao
          ORDER BY q.id_questao DESC`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const questoes = {};
          results.forEach((row) => {
            const {
              id_questao,
              enunciado,
              Enunciado_imagem,
              tipo,
              nivel,
              resposta,
              professor_nome,
              professor_pessoa_id_pessoa,
              topico_id_topico,
              topico_enunciado,
              id_alternativa,
              correta,
              alternativa_enunciado,
            } = row;

            if (!questoes[id_questao]) {
              questoes[id_questao] = {
                id_questao,
                enunciado,
                Enunciado_imagem,
                tipo,
                nivel,
                resposta,
                professor: {
                  professor_id_professor: professor_pessoa_id_pessoa,
                  professor_nome,
                },
                topico: {
                  topico_id_topico,
                  topico_enunciado,
                },
                alternativas: [],
              };
            }

            if (id_alternativa) {
              questoes[id_questao].alternativas.push({
                id_alternativa,
                correta,
                enunciado: alternativa_enunciado,
              });
            }
          });

          // Verificar se as questões estão sendo recuperadas corretamente
          console.log(questoes);

          // Converter o objeto em uma lista de questões
          const listaQuestoes = Object.values(questoes);

          // Ordenar a lista de questões por ID na ordem decrescente
          listaQuestoes.sort((a, b) => b.id_questao - a.id_questao);

          resolve(Object.values(questoes));
        }
      }
    );
  });
};

// Função para obter uma questão específica pelo seu ID
const list = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, q.topico_id_topico, t.enunciado AS topico_enunciado, q.tipo, q.nivel, q.Enunciado_imagem, q.resposta, p.nome AS professor_nome, q.professor_pessoa_id_pessoa,
       a.id_alternativa, a.correta, a.enunciado AS alternativa_enunciado
       FROM infocimol.questao q
       JOIN topico t ON q.topico_id_topico = t.id_topico
       JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
       JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
       LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao
       ORDER BY q.id_questao DESC`,
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          let questao = {};
          results.forEach((row) => {
            const {
              id_questao,
              enunciado,
              Enunciado_imagem,
              tipo,
              nivel,
              resposta,
              professor_nome,
              professor_pessoa_id_pessoa,
              topico_id_topico,
              topico_enunciado,
              id_alternativa,
              correta,
              alternativa_enunciado,
            } = row;

            // Verifica se a questão já foi adicionada ao objeto de questao
            if (!questao.id_questao) {
              questao.id_questao = id_questao;
              questao.enunciado = enunciado;
              questao.Enunciado_imagem = Enunciado_imagem;
              questao.tipo = tipo;
              questao.nivel = nivel;
              questao.resposta = resposta;
              questao.professor = {
                professor_id_professor: professor_pessoa_id_pessoa,
                professor_nome,
              };
              questao.topico = {
                topico_id_topico,
                topico_enunciado,
              };
              questao.alternativas = [];
            }

            // Verifica se a alternativa existe e adiciona ao array de alternativas da questão
            if (id_alternativa) {
              questao.alternativas.push({
                id_alternativa,
                correta,
                enunciado: alternativa_enunciado,
              });
            }
          });

          // Retorna a questão diretamente
          resolve(questao);
        }
      }
    );
  });
};

// Função para criar uma nova questão
const create = (data) => {
  return new Promise((resolve, reject) => {
    const {
      enunciado,
      Enunciado_imagem,
      tipo,
      nivel,
      resposta,
      topico_enunciado,
      professor_nome,
    } = data;

    let professor_pessoa_id_pessoa;
    let topico_id_topico;

    // Busca o ID do professor com base no nome
    connection.query(
      `SELECT pr.pessoa_id_pessoa FROM professor pr
         JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
         WHERE p.nome = ?`,
      [professor_nome],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        if (results.length === 0) {
          reject("Professor não encontrado");
          return;
        }
        professor_pessoa_id_pessoa = results[0].pessoa_id_pessoa;

        // Busca o ID do tópico com base no enunciado
        connection.query(
          `SELECT id_topico FROM topico WHERE enunciado = ?`,
          [topico_enunciado],
          (error, results) => {
            if (error) {
              reject(error);
              return;
            }

            if (results.length === 0) {
              reject("Tópico não encontrado");
              return;
            }

            topico_id_topico = results[0].id_topico;

            // Insere a nova questão na tabela 'questao'
            connection.query(
              `INSERT INTO infocimol.questao 
                (enunciado, tipo, nivel, resposta, professor_pessoa_id_pessoa, topico_id_topico, Enunciado_imagem)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                enunciado,
                tipo,
                nivel,
                resposta,
                professor_pessoa_id_pessoa,
                topico_id_topico,
                Enunciado_imagem,
              ],
              (error, result) => {
                if (error) {
                  reject(error);
                  return;
                }
                const novoIdQuestao = result.insertId;

                resolve(novoIdQuestao); // Resolve com o ID da nova questão
              }
            );
          }
        );
      }
    );
  });
};

// Função para obter detalhes de uma questão por ID
const getQuestionDetails = (idQuestao) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, t.id_topico, t.enunciado as topico, q.nivel, q.tipo, q.resposta, q.Enunciado_imagem, pr.pessoa_id_pessoa as professor_pessoa_id_pessoa, p.nome as professor_nome
        FROM questao q
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
        JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
        WHERE q.id_questao = ?`,
      [idQuestao],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            const detalhesQuestao = {
              id_questao: results[0].id_questao,
              enunciado: results[0].enunciado,
              Enunciado_imagem: results[0].Enunciado_imagem,
              tipo: results[0].tipo,
              nivel: results[0].nivel,
              resposta: results[0].resposta,
              professor: {
                professor_id_professor: results[0].professor_pessoa_id_pessoa,
                professor_nome: results[0].professor_nome,
              },
              topico: {
                topico_id_topico: results[0].id_topico,
                topico_enunciado: results[0].topico,
              },
            };
            resolve(detalhesQuestao);
          } else {
            reject("Questão não encontrada/inválida");
          }
        }
      }
    );
  });
};

//Função para editar questao por ID
const editarQuestao = async (
  tipo,
  nivel,
  enunciado,
  Enunciado_imagem,
  resposta,
  idQuestao
) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE questao SET tipo = ?, nivel = ?, enunciado = ?, Enunciado_imagem = ?, resposta = ? WHERE id_questao = ?`,
        [tipo, nivel, enunciado, Enunciado_imagem, resposta, idQuestao],
        (error, resultados) => {
          if (error) {
            reject(error); // Rejeita a Promise em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });
    return resultados;
  } catch (error) {
    throw error;
  }
};

//Função para excluir questao por ID
const excluirQuestao = async (idQuestao) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM questao WHERE id_questao = ?`,
        [idQuestao],
        (error, resultados) => {
          if (error) {
            reject(error); // Rejeita a Promise em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });
    return resultados;
  } catch (error) {
    throw error;
  }
};

//Função para obter uma questao específico pelo seu ID
const verQuestao = async (idQuestao) => {
    try {
        const resultados = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT q.id_questao, q.enunciado, t.id_topico, t.enunciado as topico, q.nivel, q.tipo, q.resposta, q.Enunciado_imagem, pr.pessoa_id_pessoa as professor_pessoa_id_pessoa, p.nome as professor_nome
                FROM questao q
                JOIN topico t ON q.topico_id_topico = t.id_topico
                JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
                JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
                WHERE q.id_questao = ?`,
                [idQuestao],
                (error, resultados) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(resultados);
                    }
                }
            );
        });
        const questao = resultados.map((questao) => ({
            id_questao: questao.id_questao,
            enunciado: questao.enunciado,
            Enunciado_imagem: questao.Enunciado_imagem,
            tipo: questao.tipo,
            nivel: questao.nivel,
            resposta: questao.resposta,
            professor: {
                professor_id_professor: questao.professor_pessoa_id_pessoa,
                professor_nome: questao.professor_nome,
            },
            topico: {
                topico_id_topico: questao.id_topico,
                topico_enunciado: questao.topico,
            },
        }));
        return questao[0];
    } catch (error) {
        return null; // Retorna null em caso de erro
    }
}

module.exports = {
  get,
  list,
  create,
  getQuestionDetails,
  editarQuestao,
  excluirQuestao,
  verQuestao,
};
