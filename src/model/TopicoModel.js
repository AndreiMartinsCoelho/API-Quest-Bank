const connection = require("./mysqlConnect").query();

// Função para criar um tópico
const criarTopico = async (enunciado, disciplina, idProfessor) => {
  try {
    const novoIdTopico = await obterNovoIdTopico();
    const nomePessoa = await obterNomePessoa(idProfessor);
    const perfil = await obterPerfilUsuario(idProfessor);
    let idDisciplina;

    if (typeof disciplina === "string") {
      idDisciplina = await obterIdDisciplinaPorNome(disciplina);
    } else {
      idDisciplina = disciplina;
    }

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
        nome_disciplina: await obterNomeDisciplina(idDisciplina)
      },
    };
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

//Função para obter o nome da disciplina
const obterNomeDisciplina = async (idDisciplina) => {
  try {
    const disciplina = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT nome FROM disciplina WHERE id_disciplina = ? LIMIT 1`,
        [idDisciplina],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados[0]?.nome || "");
          }
        }
      );
    });
    return disciplina;
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
const obterTodosOsTopicos = async (idProfessor) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT t.id_topico, t.enunciado, p.id_pessoa, p.nome AS nome_pessoa, t.professor_pessoa_id_pessoa,
          p.id_pessoa AS "usuario.pesosa_id_pessoa", u.perfil AS "usuario.perfil",
          d.id_disciplina AS "disciplina.id_disciplina", d.nome AS "disciplina.nome_disciplina"
          FROM topico t
          JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
          JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
          JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
          WHERE t.professor_pessoa_id_pessoa = ?
          ORDER BY t.id_topico DESC`,
        [idProfessor],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const topicos = [];

    for (let i = 0; i < resultados.length; i++) {
      const nomePessoa = await obterNomePessoa(resultados[i].professor_pessoa_id_pessoa);

      const topico = {
        id_topico: resultados[i].id_topico,
        enunciado: resultados[i].enunciado,
        usuario: {
          id_pessoa: resultados[i].professor_pessoa_id_pessoa,
          nome_pessoa: nomePessoa,
          perfil: resultados[i]["usuario.perfil"],
        },
        disciplina: {
          id_disciplina: resultados[i]["disciplina.id_disciplina"],
          nome_disciplina: resultados[i]["disciplina.nome_disciplina"],
        },
      };

      topicos.push(topico);
    }

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

//Função para exluir topico
const excluir = async (idTopico) => {
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM topico WHERE id_topico = ?`,
        [idTopico],
        (error, results) => {
          if (error) {
            reject(error); // Rejeita o erro em caso de falha
          } else if (results.affectedRows === 0) {
            reject(new Error("O id do tópico não existe mais."));
          } else {
            resolve({ auth: true });
          }
        }
      );
    });

    return result; // Retorna o resultado da query (deve ser true se excluído com sucesso)
  } catch (error) {
    throw error; // Lança o erro para ser capturado no bloco catch
  }
};

//Função para editar topico
const editar = async (idTopico, enunciado) => {
  try {
    await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE topico SET enunciado = ? WHERE id_topico = ?`,
        [enunciado, idTopico],
        (error) => {
          if (error) {
            reject(error); // Rejeita o erro em caso de falha
          } else {
            resolve();
          }
        }
      );
    });

    const topico = await obterTopicoPorId(idTopico);

    return topico;
  } catch (error) {
    throw error; // Lança o erro para ser capturado no bloco catch
  }
};

// Função para obter um tópico específico pelo seu ID
const obterTopicoPorId = async (idTopico) => {
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
            WHERE t.id_topico = ?`,
        [idTopico],
        (error, resultados) => {
          if (error) {
            resolve(null); // Retorna null em caso de erro
          } else {
            resolve(resultados);
          }
        }
      );
    });

    const topico = resultados.map((topico) => ({
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

    return topico[0];
  } catch (error) {
    return null; // Retorna null em caso de erro
  }
};

//Função para obter um topico pelo enunciado
const obterTopicoPorEnunciado = (enunciado) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT t.id_topico, t.enunciado, p.id_pessoa, p.nome AS nome_pessoa,
          p.id_pessoa AS "usuario.id_pessoa", p.nome AS "usuario.nome_pessoa", u.perfil AS "usuario.perfil",
          d.id_disciplina AS "disciplina.id_disciplina", d.nome AS "disciplina.nome_disciplina"
          FROM topico t
          JOIN pessoa p ON t.professor_pessoa_id_pessoa = p.id_pessoa
          JOIN usuario u ON p.id_pessoa = u.pessoa_id_pessoa
          JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
          WHERE t.enunciado LIKE ?`,
      [`%${enunciado}%`],
      async (error, results) => {
        if (error) {
          reject(error);
        } else {
          const topicos = await Promise.all(
            results.map(async (topico) => {
              return {
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
                }
              };
            })
          );
          resolve(topicos);
        }
      }
    );
  });
};

module.exports = {
  criarTopico,
  obterIdDisciplinaPorNome,
  obterTodosOsTopicos,
  obterNovoIdTopico,
  excluir,
  editar,
  obterTopicoPorId,
  obterNomeDisciplina,
  obterTopicoPorEnunciado
};