const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

const get = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.formato, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
      FROM infocimol.prova p
      JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
      JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa;`,
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
}

//Função para obter as prova
const listar = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.formato, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
       FROM infocimol.prova p
       JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
       JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
       WHERE p.id_prova = ?;`,
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
}

//Função para obter as questões de uma prova
const getQuestoes = (provaId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT q.id_questao, q.enunciado AS questao_enunciado, q.Enunciado_imagem AS questao_enunciado_imagem, q.tipo AS questao_tipo, q.nivel AS questao_nivel,
         pp.id_pessoa AS professor_id_professor, pp.nome AS professor_nome,
         t.id_topico AS topico_id_topico, t.enunciado AS topico_enunciado
         FROM infocimol.questao_prova qp
         JOIN questao q ON qp.questao_id_questao = q.id_questao
         JOIN pessoa pp ON q.professor_pessoa_id_pessoa = pp.id_pessoa
         JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
         JOIN topico t ON q.topico_id_topico = t.id_topico
         WHERE qp.prova_id_prova = ?;`,
        [provaId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            const questoes = results.map((questao) => ({
              id_questao: questao.id_questao,
              enunciado: questao.questao_enunciado,
              Enunciado_imagem: questao.questao_enunciado_imagem,
              tipo: questao.questao_tipo,
              nivel: questao.questao_nivel,
              professor: {
                professor_id_professor: questao.professor_id_professor,
                professor_nome: questao.professor_nome,
              },
              topico: {
                topico_id_topico: questao.topico_id_topico,
                topico_enunciado: questao.topico_enunciado,
              }
            }));
            resolve(questoes);
          }
        }
      );
    });
}

module.exports = { get, listar, getQuestoes };
