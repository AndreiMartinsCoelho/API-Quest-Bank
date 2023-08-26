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
      LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao;`,
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

            // Verifica se a questão já foi adicionada ao objeto de questoes
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

            // Verifica se a alternativa existe e adiciona ao array de alternativas da questão
            if (id_alternativa) {
              questoes[id_questao].alternativas.push({
                id_alternativa,
                correta,
                enunciado: alternativa_enunciado,
              });
            }
          });

          // Retorna o array de questões diretamente
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
      `SELECT q.id_questao, q.enunciado, q.topico_id_topico, t.enunciado AS topico_enunciado, q.tipo, q.Enunciado_imagem, q.resposta, q.nivel, p.nome AS professor_nome, q.professor_pessoa_id_pessoa,
      a.id_alternativa, a.correta, a.enunciado AS alternativa_enunciado
      FROM infocimol.questao q
      JOIN topico t ON q.topico_id_topico = t.id_topico
      JOIN professor pr ON q.professor_pessoa_id_pessoa = pr.pessoa_id_pessoa
      JOIN pessoa p ON pr.pessoa_id_pessoa = p.id_pessoa
      LEFT JOIN alternativa a ON q.id_questao = a.questao_id_questao
      WHERE q.id_questao = ?;`,
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

module.exports = { get, list };