const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para obter um tópico específico pelo seu ID
const list = (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT t.id_topico, t.enunciado, 
      p.id_pessoa, p.nome AS nome_pessoa,
      u.id_pessoa AS "usuario.id_pessoa",
      u.nome AS "usuario.nome_pessoa", 
      u.perfil AS "usuario.perfil",
      d.id_disciplina AS "disciplina.id_disciplina", 
      d.nome AS "disciplina.nome_disciplina"
      FROM infocimol.topico t
      JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
      JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
      JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
      ORDER BY t.id_topico DESC`,
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
            disciplina: {
              id_disciplina: topico["disciplina.id_disciplina"],
              nome_disciplina: topico["disciplina.nome_disciplina"],
            },
          }));
          resolve(topicos);
        }
      }
    );
  });
};

// Função para criar um tópico
const criarTopico = async (enunciado, idDisciplina, idProfessor) => {
  try {
    const novoIdTopico = await obterNovoIdTopico();
    const nomePessoa = await obterNomePessoa(idProfessor);
    const perfil = await obterPerfilUsuario(idProfessor);

    await new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO topico (id_topico, enunciado, disciplina_id_disciplina, professor_pessoa_id_pessoa) VALUES (?, ?, ?, ?)`,
        [novoIdTopico, enunciado, idDisciplina, idProfessor],
        (error) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve();
          }
        }
      );
    });

    return {
      id_topico: novoIdTopico,
      enunciado,
      usuario: {
        id_pessoa: idProfessor,
        nome_pessoa: nomePessoa,
        perfil,
      },
      disciplina: {
        id_disciplina: idDisciplina,
      },
    };
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

// Função para obter o id da disciplina pelo nome
const obterIdDisciplinaPorNome = async (nomeDisciplina) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT id_disciplina FROM disciplina WHERE nome = ? LIMIT 1`,
        [nomeDisciplina],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const idDisciplina = resultados[0]?.id_disciplina;
    return idDisciplina;
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

// Função para obter todos os tópicos
const obterTodosOsTopicos = async () => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT t.id_topico, t.enunciado, p.id_pessoa, p.nome AS nome_pessoa,
          p.id_pessoa AS "usuario.id_pessoa", p.nome AS "usuario.nome_pessoa", u.perfil AS "usuario.perfil",
          d.id_disciplina AS "disciplina.id_disciplina", d.nome AS "disciplina.nome_disciplina"
          FROM topico t
          JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
          JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
          JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
          ORDER BY t.id_topico DESC`,
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const topicos = resultados.map((topico) => ({
      id_topico: topico.id_topico,
      enunciado: topico.enunciado,
      usuario: {
        id_pessoa: topico["usuario.id_pessoa"],
        nome_pessoa: topico["usuario.nome_pessoa"],
        perfil: topico["usuario.perfil"],
      },
      disciplina: {
        id_disciplina: topico["disciplina.id_disciplina"],
        nome_disciplina: topico["disciplina.nome_disciplina"],
      },
    }));

    return topicos;
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

// Função para obter o próximo id do tópico
const obterNovoIdTopico = async () => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT MAX(id_topico) AS max_id FROM topico",
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const proximoId = resultados[0]?.max_id ? resultados[0].max_id + 1 : 1;
    return proximoId;
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

//Função para obter o nome da pessoa pelo id do professor
const obterNomePessoa = async (idProfessor) => {
  try {
    const pessoa = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT nome FROM pessoa WHERE id_pessoa = ? LIMIT 1`,
        [idProfessor],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados[0]?.nome || "");
          }
        }
      );
    });
    return pessoa;
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

//Função para obter o perfil do usuário pelo id do professor
const obterPerfilUsuario = async (idProfessor) => {
  try {
    const usuario = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ? LIMIT 1`,
        [idProfessor],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados[0]?.perfil || "");
          }
        }
      );
    });
    return usuario;
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

module.exports = {
  list,
  criarTopico,
  obterIdDisciplinaPorNome,
  obterTodosOsTopicos,
  obterNovoIdTopico,
};
