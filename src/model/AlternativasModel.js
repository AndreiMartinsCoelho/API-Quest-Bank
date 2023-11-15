const connection = require("./mysqlConnect").query();

//----Função para criar um alternativa----
const criarAlternativa = async (enunciado, idQuestao, correta) => {
  //----Função TRIM para não permitir campo vazios nas COLUNAS----
  if (enunciado.trim() === '') {
    throw new Error('Enunciado e correta não podem ser vazios.');
  }
  //----Se tiver tudo OK, cria a ALTERNATIVA
  try {
    const novoIdAlternativa = await obterNovoIdAlternativa(); //----Cria um ID para a alternativa----
    //----INSERT para criar uma ALTERNTIVA----
    await new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO alternativa (id_alternativa, enunciado, questao_id_questao, correta) VALUES (?, ?, ?, ?)`,
        [novoIdAlternativa, enunciado, idQuestao, correta],
        (error) => {
          if (error || "") {
            resolve(null); // ----Retorna NULL em caso de erro----
          } else {
            resolve();
          }
        }
      );
    });

    //----Retorna os resultados na resposta----
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT a.id_alternativa, a.enunciado, a.correta, q.id_questao, q.nivel, q.tipo, q.enunciado AS questao_enunciado, q.enunciado_imagem AS questao_enunciado_imagem, q.resposta, t.id_topico, t.enunciado AS topico_enunciado, d.id_disciplina, d.nome AS disciplina_nome
        FROM infocimol.alternativa a
        JOIN questao q ON a.questao_id_questao = q.id_questao
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
        WHERE a.id_alternativa = ?`,
        [novoIdAlternativa],
        (error, resultados) => {
          if (error) {
            resolve(null); //----Retorna NULL em caso de erro----
          } else {
            resolve(resultados);
          }
        }
      );
    });

    //----Return das respostas----
    return {
      id_alternativa: novoIdAlternativa,
      enunciado,
      correta,
      questao: {
        id_questao: resultados[0].id_questao,
        enunciado: resultados[0].questao_enunciado,
        enunciado_imagem: resultados[0].questao_enunciado_imagem,
        resposta: resultados[0].resposta,
        nivel: resultados[0].nivel,
        tipo: resultados[0].tipo,
      },
      topico: {
        id_topico: resultados[0].id_topico,
        enunciado: resultados[0].topico_enunciado,
        disciplina: {
          id_disciplina: resultados[0].id_disciplina,
          nome: resultados[0].disciplina_nome,
        },
      },
    };
  } catch (error) {
    return null; //----Retorna NULL em caso de erro----
  }
};

//----Função para obter o id da questao pelo enunciado----
const obterIdQuestaoPorEnunciado = async (enunciadoQuestao) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT id_questao FROM questao WHERE enunciado = ? LIMIT 1`,
        [enunciadoQuestao],
        (error, resultados) => {
          if (error) {
            resolve(null); //----Retorna NULL em caso de erro----
          } else {
            resolve(resultados);
          }
        }
      );
    });
    //----Percorre os RESULTADOS e adiciona a QUESTÃO----
    if (resultados && resultados.length > 0) {
      return resultados[0].id_questao;
    } else {
      return null; //----Retorna NULL se não encontrar----
    }
  } catch (error) {
    return null; //----Retorna NULL em caso de erro----
  }
};

//----FUNÃO para PEGEAR TODAS AS ALTERNATIVAS----
const get = () => {
  return new Promise((resolve, reject) => { //----Retorna uma PROMISE----
    connection.query(
      `SELECT a.id_alternativa, q.id_questao, q.nivel, q.tipo, q.resposta AS resposta, q.enunciado AS questao_enunciado, q.enunciado_imagem AS questao_enunciado_imagem, a.enunciado AS enunciado, a.correta, t.id_topico, t.enunciado AS topico_enunciado, d.id_disciplina, d.nome AS disciplina_nome
       FROM infocimol.alternativa a
       JOIN questao q ON a.questao_id_questao = q.id_questao
       JOIN topico t ON q.topico_id_topico = t.id_topico
       JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
       ORDER By a.id_alternativa DESC`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const alternativas = results.map((alternativa) => ({
            id_alternativa: alternativa.id_alternativa,
            enunciado: alternativa.enunciado,
            correta: alternativa.correta,
            questao: {
              id_questao: alternativa.id_questao,
              enunciado: alternativa.questao_enunciado,
              enunciado_imagem: alternativa.questao_enunciado_imagem,
              resposta: alternativa.resposta,
              nivel: alternativa.nivel,
              tipo: alternativa.tipo,
            },
            topico: {
              id_topico: alternativa.id_topico,
              enunciado: alternativa.topico_enunciado,
              disciplina: {
                id_disciplina: alternativa.id_disciplina,
                nome: alternativa.disciplina_nome,
              },
            },
          }));
          resolve(alternativas);
        }
      }
    );
  });
};

//----Pequena para ADICIONAR um ID----
const obterNovoIdAlternativa = async () => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT MAX(id_alternativa) as id FROM alternativa`,
        (error, resultados) => {
          if (error) {
            resolve(null); //----Retorna NULL em caso de erro---
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const novoIdAlternativa = resultados[0].id + 1; //----Adiciona um novo ID para a prox ALTERNATIVA----
    return novoIdAlternativa;

  } catch (error) {
    return null; //----Retorna NULL em caso de erro----
  }
};

//----Função para ATUALIZAR a ALTERNATIVA----
const editarAlternativa = async (enunciado, correta, idAlternativa, enunciadoQuestao) => {
  //----Função TRIM para não permitir campo vazios nas COLUNAS----
  if (enunciado.trim() === '' || correta.trim() === '') {
    throw new Error('Enunciado e correta não podem ser vazios.');
  }

  const idQuestao = await obterIdQuestaoPorEnunciado(enunciadoQuestao);
  
  //----Se tiver tudo OK, ATUALIZA a alternativa----
  try {
    await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE alternativa SET enunciado = ?, correta = ?, questao_id_questao = ? WHERE id_alternativa = ?`,
        [enunciado, correta, idQuestao, idAlternativa],
        (error) => {
          if (error || "") {
            resolve(null); //----Retorna NULL em caso de erro----
          } else {
            resolve();
          }
        }
      );
    });

    //----RESULTADOS da ATUALIZAÇÃO----
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT a.id_alternativa, a.enunciado, a.correta, q.id_questao, q.nivel, q.tipo, q.enunciado AS questao_enunciado, q.enunciado_imagem AS questao_enunciado_imagem, q.resposta, t.id_topico, t.enunciado AS topico_enunciado, d.id_disciplina, d.nome AS disciplina_nome
        FROM infocimol.alternativa a
        JOIN questao q ON a.questao_id_questao = q.id_questao
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
        WHERE a.id_alternativa = ?`,
        [idAlternativa],
        (error, resultados) => {
          if (error) {
            resolve(null); //----Retorna NULL em caso de erro----
          } else {
            resolve(resultados);
          }
        }
      );
    });

    //----Retorna a ALTERNATIVA ATUALIZADA----
    const alternativaEditada = {
      id_alternativa: idAlternativa,
      enunciado,
      correta,
      questao: {
        id_questao: resultados[0].id_questao,
        enunciado: resultados[0].questao_enunciado,
        enunciado_imagem: resultados[0].questao_enunciado_imagem,
        resposta: resultados[0].resposta,
        nivel: resultados[0].nivel,
        tipo: resultados[0].tipo,
      },
      topico: {
        id_topico: resultados[0].id_topico,
        enunciado: resultados[0].topico_enunciado,
        disciplina: {
          id_disciplina: resultados[0].id_disciplina,
          nome: resultados[0].disciplina_nome,
        },
      },
    };

    console.log(alternativaEditada);
    return alternativaEditada;

  } catch (error) {
    throw error;
  }
};

//----Função para DELETAR ALTERNATIVA----
const excluirAlternativa = (idAlternativa) => {
  try{
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM alternativa WHERE id_alternativa = ?`,
      [idAlternativa],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.affectedRows === 0) { //----Se não existir o ID, retorna essa LINDA MSG----
          reject(new Error(`Não foi possível encontrar a alternativa com o id ${idAlternativa}`));
        } else {
          resolve(results);
        }
      }
    );
  });
  } catch (error) {
    throw error;
  }
};

//----Função para OBTER uma ALTERNATIVA por um ID----
const obterAlternativaPorId = async (idAlternativa) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT a.id_alternativa, a.enunciado, a.correta, q.id_questao, q.nivel, q.tipo, q.enunciado AS questao_enunciado, q.enunciado_imagem AS questao_enunciado_imagem, q.resposta, t.id_topico, t.enunciado AS topico_enunciado, d.id_disciplina, d.nome AS disciplina_nome
        FROM infocimol.alternativa a
        JOIN questao q ON a.questao_id_questao = q.id_questao
        JOIN topico t ON q.topico_id_topico = t.id_topico
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
         WHERE a.id_alternativa = ?`,
        [idAlternativa],
        (error, resultados) => {
          if (error) {
            resolve(null); //----Retorna NULL em caso de erro----
          } else {
            resolve(resultados);
          }
        }
      );
    });

    //----Retorna os RESULTADOS----
    if (resultados && resultados.length > 0) {
      return {
        id_alternativa: resultados[0].id_alternativa,
        enunciado: resultados[0].enunciado,
        correta: resultados[0].correta,
        questao: {
          id_questao: resultados[0].id_questao,
          enunciado: resultados[0].questao_enunciado,
          enunciado_imagem: resultados[0].questao_enunciado_imagem,
          resposta: resultados[0].resposta,
          nivel: resultados[0].nivel,
          tipo: resultados[0].tipo,
          topico: {
            id_topico: resultados[0].id_topico,
            enunciado: resultados[0].topico_enunciado,
            disciplina: {
              id_disciplina: resultados[0].id_disciplina,
              nome: resultados[0].disciplina_nome,
            },
          },
        },
      };
    } else {
      return null; //----Retorna NULL se não encontrar----
    }
  } catch (error) {
    return null; //----Retorna NULL em caso de erro----
  }
};

module.exports = {
  criarAlternativa,
  obterIdQuestaoPorEnunciado,
  obterNovoIdAlternativa,
  get,
  editarAlternativa,
  excluirAlternativa,
  obterAlternativaPorId,
};
