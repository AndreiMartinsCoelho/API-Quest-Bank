const connection = require("./mysqlConnect").query();
const fs = require("fs");
const path = require("path");

//----Função para LISTAR as QUESTÕES por PROFESSOR----
const get = (idProfessor) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, q.topico_id_topico, t.enunciado AS topico_enunciado, t.disciplina_id_disciplina, d.nome AS disciplina_nome, q.tipo, q.nivel, q.Enunciado_imagem, q.resposta, p.nome AS professor_nome, q.professor_pessoa_id_pessoa,
          a.id_alternativa, a.correta, a.enunciado AS alternativa_enunciado
          FROM infocimol.questao q
          JOIN topico t ON q.topico_id_topico = t.id_topico
          JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
          JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
          JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
          LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao
          WHERE q.professor_pessoa_id_pessoa = ?
          ORDER BY q.id_questao ASC`,
      [idProfessor],
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
              disciplina_id_disciplina,
              disciplina_nome,
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
                  disciplina: {
                    disciplina_id_disciplina,
                    disciplina_nome,
                  },
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

          //----Ordena as QUESTÕES por ID de forma DESCRESCENTE----      
          const listaQuestoes = Object.values(questoes);
          listaQuestoes.sort((a, b) => b.id_questao - a.id_questao);
          resolve(Object.values(listaQuestoes));
        }
      }
    );
  })
};

//----Função para LISTAS as QUESTÕES----
const getQuestoes = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, q.topico_id_topico, t.enunciado AS topico_enunciado, t.disciplina_id_disciplina, d.nome AS disciplina_nome, q.tipo, q.nivel, q.Enunciado_imagem, q.resposta, p.nome AS professor_nome, q.professor_pessoa_id_pessoa,
          a.id_alternativa, a.correta, a.enunciado AS alternativa_enunciado
          FROM infocimol.questao q
          JOIN topico t ON q.topico_id_topico = t.id_topico
          JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
          JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
          JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
          LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao
          ORDER BY q.id_questao ASC`,
          [id],
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
              disciplina_id_disciplina,
              disciplina_nome,
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
                  disciplina: {
                    disciplina_id_disciplina,
                    disciplina_nome,
                  },
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

          //----Ordena as QUESTÕES por ID de forma DESCRESCENTE----       
          const listaQuestoes = Object.values(questoes);
          listaQuestoes.sort((a, b) => b.id_questao - a.id_questao);
          resolve(Object.values(listaQuestoes));
        }
      }
    );
  })
};

//----FUNÇÃO PARA ADICIONAR QUESTÃO----
const create = (data) => {
  return new Promise((resolve, reject) => {
    const { enunciado, Enunciado_imagem, tipo, nivel, resposta, topico_enunciado, professor_nome} = data;

    //----Função TRIM para não permitir campo vazios nas COLUNAS----
    if(enunciado.trim() ==='' || tipo.trim() ==='' || nivel.trim() ==='' || topico_enunciado ==='' || professor_nome.trim() ===''){
      throw new Error('Os campos não podem ser vazios.');
    }

    let professor_pessoa_id_pessoa;
    let topico_id_topico;

    //----Busca o ID do PROF----
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

        //----Busca o ID do TÓPICO com base no ENUNCIADO----
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

            connection.query(
              `INSERT INTO infocimol.questao 
                (enunciado, tipo, nivel, resposta, professor_pessoa_id_pessoa, topico_id_topico, Enunciado_imagem)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [enunciado, tipo, nivel, resposta, professor_pessoa_id_pessoa, topico_id_topico, Enunciado_imagem],
              (error, result) => {
                if (error) {
                  reject(error);
                  return;
                }
                const novoIdQuestao = result.insertId;

                resolve(novoIdQuestao); //----Resolve com o ID da NOVA questão----
              }
            );
          }
        );
      }
    );
  });
};

//----Função para OBTER os DETALHES de uma QUESTÃO por ID----
const getQuestionDetails = (idQuestao) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT q.id_questao, q.enunciado, t.id_topico, t.enunciado as topico, q.nivel, q.tipo, q.resposta, q.Enunciado_imagem, pr.pessoa_id_pessoa as professor_pessoa_id_pessoa, p.nome as professor_nome, d.id_disciplina, d.nome as nome
        FROM questao q
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
        JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
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
                topico_enunciado: results[0].topico
              },
              disciplina: {
                disciplina_id_disciplina: results[0].id_disciplina,
                disciplina_nome: results[0].nome
              }
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
const editarQuestao = async ( tipo,  nivel, enunciado, Enunciado_imagem, resposta, idQuestao) => {
  //----Função TRIM para não permitir campo vazios nas COLUNAS----
  if(enunciado.trim() ==='' || tipo.trim() ==='' || nivel.trim() ===''){
    throw new Error('Os campos não podem ser vazios.');
  }

  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE questao SET tipo = ?, nivel = ?, enunciado = ?, Enunciado_imagem = ?, resposta = ? WHERE id_questao = ?`,
        [tipo, nivel, enunciado, Enunciado_imagem, resposta, idQuestao],
        (error, resultados) => {
          if (error) {
            reject(error); //----Rejeita a Promise em caso de ERRO----
          } else {
            resolve(resultados);
          }
        }
      );
    });
    const updatedQuestion = await getQuestionDetails(idQuestao);
    console.log(resultados);
    return updatedQuestion;
  } catch (error) {
    throw error;
  }
};

//----Função para DELETAR uma QUESTÃO por ID----
const excluirQuestao = async (idQuestao) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM questao WHERE id_questao = ?`,
        [idQuestao],
        (error, resultados) => {
          if (error) {
            reject(error); //----Rejeita a Promise em caso de ERRO----
          } else {
            resolve(resultados);
          }
        }
      );
    });
    if (resultados.affectedRows > 0) {
      return resultados;
    } else {
      throw new Error("Questão não encontrada");
    }
  } catch (error) {
    throw error;
  }
};

//----Função para OBTER todas as ALTERNATIVAS de uma QUESTÃO----
const getAlternativas = async (idQuestao) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM alternativa WHERE questao_id_questao = ?`,
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
    const alternativas = resultados.map((alternativa) => ({
      id_alternativa: alternativa.id_alternativa,
      enunciado: alternativa.enunciado,
      correta: alternativa.correta,
    }));
    return alternativas;
  } catch (error) {
    throw error;
  }
};

//----Função para OBTER uma QUESTÃO específico pelo seu ID----
const verQuestao = async (idQuestao) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT q.id_questao, q.enunciado, t.id_topico, t.enunciado as topico, q.nivel, q.tipo, q.resposta, q.Enunciado_imagem, pr.pessoa_id_pessoa as professor_pessoa_id_pessoa, p.nome as professor_nome, d.id_disciplina, d.nome as nome
        FROM questao q
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
        JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
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
    const questao = resultados.map(async (questao) => ({
      id_questao: questao.id_questao,
      enunciado: questao.enunciado,
      enunciado_imagem: questao.Enunciado_imagem,
      tipo: questao.tipo,
      nivel: questao.nivel,
      resposta: questao.resposta,
      professor: {
        id_professor: questao.professor_pessoa_id_pessoa,
        nome: questao.professor_nome,
      },
      topico: {
        id_topico: questao.id_topico,
        enunciado: questao.topico,
        disciplina: {
          id_disciplina: questao.id_disciplina,
          nome: questao.nome,
        },
      },
      alternativas: await getAlternativas(questao.id_questao),
    }));
    console.log(questao);
    return questao[0];
  } catch (error) {
    return null;
  }
};

//----Função para BUSCAR pelo ENUNCIADO da QUESTÃO----
const buscarQuestoesPorEnunciado = async (enunciado) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT q.id_questao, q.enunciado, t.id_topico, t.enunciado as topico, q.nivel, q.tipo, q.resposta, q.Enunciado_imagem, pr.pessoa_id_pessoa as professor_pessoa_id_pessoa, p.nome as professor_nome, d.id_disciplina, d.nome as nome
        FROM questao q
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
        JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
        WHERE q.enunciado LIKE ?`,
        [`%${enunciado}%`],
        (error, resultados) => {
          if (error) {
            reject(error);
          } else {
            resolve(resultados);
          }
        }
      );
    });
    const questoes = resultados.map((questao) => ({
      id_questao: questao.id_questao,
      enunciado: questao.enunciado,
      enunciado_imagem: questao.Enunciado_imagem,
      tipo: questao.tipo,
      nivel: questao.nivel,
      resposta: questao.resposta,
      professor: {
        id_professor: questao.professor_pessoa_id_pessoa,
        nome: questao.professor_nome,
      },
      topico: {
        id_topico: questao.id_topico,
        enunciado: questao.topico,
        disciplina: {
          id_disciplina: questao.id_disciplina,
          nome: questao.nome,
        },
      }
    }));
    console.log(questoes);
    return (questoes);
  } catch (error) {
    return null;
  }
};

module.exports = {
  get,
  create,
  getQuestionDetails,
  editarQuestao,
  excluirQuestao,
  verQuestao,
  getAlternativas,
  buscarQuestoesPorEnunciado,
  getQuestoes
};
