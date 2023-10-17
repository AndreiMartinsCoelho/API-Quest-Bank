const connection = require("./mysqlConnect").query();
const PDFDocument = require("pdfkit");
const fs = require("fs");

//Função para criar uma prova
const criar = (novaProva) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(
        `INSERT INTO infocimol.prova (descricao, tipo, professor_pessoa_id_pessoa, enunciado)
        VALUES (?, ?, ?, ?);`,
        [
          novaProva.descricao,
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
      `SELECT p.id_prova, p.descricao, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
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
      `SELECT q.enunciado AS questao_enunciado, q.id_questao AS questao_id, q.tipo AS questao_tipo, q.nivel AS questao_nivel, 
      q.Enunciado_imagem AS questao_enunciado_imagem, q.resposta AS questao_resposta, q.topico_id_topico AS questao_topico_id_topico,
      t.disciplina_id_disciplina AS questao_topico_disciplina_id_disciplina, t.enunciado AS questao_topico_enunciado,
      d.nome AS questao_topico_disciplina_nome
      FROM infocimol.questao_prova qp
      JOIN questao q ON qp.questao_id_questao = q.id_questao
      JOIN topico t ON q.topico_id_topico = t.id_topico
      JOIN disciplina d ON t.disciplina_id_disciplina = d.id_disciplina
      WHERE qp.prova_id_prova = ?;`,
      [provaId],
      async (error, results) => {
        if (error) {
          reject(error);
        } else {
          const questoes = await Promise.all(
            results.map(async (questao) => {
              const alternativas = await getAlternativas(questao.questao_id);
              return {
                questao_id: questao.questao_id,
                questao_enunciado: questao.questao_enunciado,
                questao_tipo: questao.questao_tipo,
                questao_nivel: questao.questao_nivel,
                questao_enunciado_imagem: questao.questao_enunciado_imagem,
                questao_resposta: questao.questao_resposta,
                topicos: {
                  questao_topico_id_topico: questao.questao_topico_id_topico,
                  questao_topico_enunciado: questao.questao_topico_enunciado,
                  disciplina: {
                    questao_topico_disciplina_id_disciplina:
                      questao.questao_topico_disciplina_id_disciplina,
                    questao_topico_disciplina_nome:
                      questao.questao_topico_disciplina_nome,
                  },
                },
                alternativas: alternativas,
              };
            })
          );
          resolve(questoes);
        }
      }
    );
  });
};

//Função para obter as alternativas de uma questão
const getAlternativas = (questaoId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id_alternativa, enunciado, correta FROM alternativa WHERE questao_id_questao = ?`,
      [questaoId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const alternativas = results.map((alternativa) => ({
            id_alternativa: alternativa.id_alternativa,
            enunciado: alternativa.enunciado,
            correta: alternativa.correta,
          }));
          resolve(alternativas);
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
      `SELECT p.id_prova, p.descricao, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
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
      `SELECT * FROM prova WHERE id_prova = ?`,
      [idProva],
      async (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          reject(new Error(`Prova com id ${idProva} não existe no banco.`));
        } else {
          const prova = results[0];
          // Update the prova information in the database
          connection.query(
            `UPDATE prova SET descricao = ?, tipo = ?, enunciado = ? WHERE id_prova = ?`,
            [descricao, tipo, enunciado, idProva],
            async (error, results) => {
              if (error) {
                reject(error);
              } else {
                const questoes = await getQuestoes(idProva);
                resolve({
                  id_prova: prova.id_prova,
                  enunciado: enunciado,
                  tipo: tipo,
                  criado_por: prova.professor_pessoa_id_pessoa,
                  descricao: descricao,
                  questoes: questoes,
                });
              }
            }
          );
        }
      }
    );
  });
};

//Função para excluir prova
const excluirProva = (idProva) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM prova WHERE id_prova = ?`,
      [idProva],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          reject(new Error(`Prova com id ${idProva} não existe no banco.`));
        } else {
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
        }
      }
    );
  });
};

//Função para buscar uma prova pelo enunciado
const buscarProvaPorEnunciado = (enunciado) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
        FROM infocimol.prova p
        JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
        JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
        WHERE p.enunciado LIKE '%${enunciado}%'
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

//Função para gerar a prova em PDF
const gerarPDF = (prova) => {
  if (!prova || !prova.id_prova) {
    throw new Error("Prova inválida");
  }
  const imagePath ="./src/model/img/logo.jpeg";
  const nomeArquivo = `prova_${prova.id_prova}.pdf`;
  const stream = fs.createWriteStream(nomeArquivo);
  const doc = new PDFDocument();
  doc.info.Title = `Prova ${prova.id_prova}`;

  const larguraImagem = 35;

  const yPos = doc.y + 20;

  doc.image(imagePath, 50, yPos, { width: larguraImagem });

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(
      "ESCOLA TÉCNICA ESTADUAL MONTEIRO LOBATO",
      50 + larguraImagem + 15,
      yPos
    );
  if (prova.questoes && prova.questoes.length > 0) {
    const QuestoesRandom = ArrayRandom(prova.questoes);
    QuestoesRandom.forEach((questao, index) => {
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(
          `${questao.topicos.disciplina.questao_topico_disciplina_nome} - ${prova.criado_por.professor_nome}`,
          50 + larguraImagem + 15,
          doc.y + 10
        );
    });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Orientações`, 50, doc.y + 20);
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(`${prova.descricao}`, { align: "left" })
    .moveDown(0.5);

  //Array que armazena as questões da prova em ordem aleatória
  function ArrayRandom(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Adiciona as questões da prova
  if (prova.questoes && prova.questoes.length > 0) {
    //Questões da prova em ordem aleatória
    const QuestoesRandom = ArrayRandom(prova.questoes);
    QuestoesRandom.forEach((questao, index) => {
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`${index + 1}) ${questao.questao_enunciado}`, { align: "left" });

      //Alternativas de cada questão em ordem aleatória
      if (questao.alternativas && questao.alternativas.length > 0) {
        const RandomAlternativas = ArrayRandom(questao.alternativas);
        RandomAlternativas.forEach((alternativa, index) => {
          doc.text(
            `${String.fromCharCode(97 + index)}) ${alternativa.enunciado}`,
            { align: "left", indent: 20 }
          );
        });
      }

      // // Adiciona a resposta correta da questão

      doc.moveDown(0.5);
    });
  }

  stream.on("finish", () => {
    console.log(`Arquivo ${nomeArquivo} gerado com sucesso`);
  });

  doc.pipe(stream);
  doc.end();
  
  return nomeArquivo;
};

//Função para obter uma prova específico pelo seu ID
const obterProvaPorId = async (idProva) => {
  try {
    const resultados = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT p.id_prova, p.descricao, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
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
      tipo: prova.tipo,
      criado_por: {
        professor_pessoa_id_pessoa: prova.professor_pessoa_id_pessoa,
        professor_nome: prova.professor_nome,
      },
      descricao: prova.descricao,
      questoes: questoes,
    }))[0]; // Retorna apenas o primeiro elemento do array

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
  getAlternativas,
  buscarProvaPorEnunciado,
  gerarPDF,
};
