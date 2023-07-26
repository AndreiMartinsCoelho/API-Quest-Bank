const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para obter todos os tópicos
const get = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT t.id_topico, t.enunciado, p.id_pessoa, p.nome AS nome_pessoa,
        p.id_pessoa AS "usuario.id_pessoa", p.nome AS "usuario.nome_pessoa", u.perfil AS "usuario.perfil",
        d.id_disciplina AS "Disciplina.id_disciplina", d.nome AS "Disciplina.nome_disciplina"
        FROM infocimol.topico t
        JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
        JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina;`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const topicos = results.map((topico) => ({
            id_topico: topico.id_topico,
            enunciado: topico.enunciado,
            usuario: {
              id_pessoa: topico["usuario.id_pessoa"],
              nome_pessoa: topico["usuario.nome_pessoa"],
              perfil: topico["usuario.perfil"],
            },
            Disciplina: {
              id_disciplina: topico["Disciplina.id_disciplina"],
              nome_disciplina: topico["Disciplina.nome_disciplina"],
            },
          }));
          resolve(topicos);
        }
      }
    );
  });
};

// Função para obter um tópico específico pelo seu ID
const list = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT t.id_topico, t.enunciado, p.id_pessoa, p.nome AS nome_pessoa,
        p.id_pessoa AS "usuario.id_pessoa", p.nome AS "usuario.nome_pessoa", u.perfil AS "usuario.perfil",
        d.id_disciplina AS "Disciplina.id_disciplina", d.nome AS "Disciplina.nome_disciplina"
        FROM infocimol.topico t
        JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
        JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
        JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
        WHERE t.id_topico = ?;`,
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const topicos = results.map((topico) => ({
            id_topico: topico.id_topico,
            enunciado: topico.enunciado,
            usuario: {
              id_pessoa: topico["usuario.id_pessoa"],
              nome_pessoa: topico["usuario.nome_pessoa"],
              perfil: topico["usuario.perfil"],
            },
            Disciplina: {
              id_disciplina: topico["Disciplina.id_disciplina"],
              nome_disciplina: topico["Disciplina.nome_disciplina"],
            },
          }));
          resolve(topicos);
        }
      }
    );
  });
};

module.exports = { get, list };

