const connection = require("./mysqlConnect").query();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const util = require("util");

//----Função para INSERIR as QUESTÕES para uma PROVA----
const inserirQuestaoPorEnunciado = async (provaId, questaoEnunciado) => {
  return new Promise(async (resolve, reject) => {
    const insertQuery = `
      INSERT INTO infocimol.questao_prova (questao_id_questao, prova_id_prova)
      VALUES (?, ?);
    `;
    const queryAsync = util.promisify(connection.query).bind(connection);

    try {
      const [result] = await queryAsync(
        `SELECT id_questao FROM questao WHERE enunciado = ?`,
        [questaoEnunciado]
      );

      if (result && result.id_questao) {
        connection.query(
          insertQuery,
          [result.id_questao, provaId],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      } else {
        reject(
          new Error(
            `Questão com enunciado "${questaoEnunciado}" não encontrada.`
          )
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};

//----Função para ADICIONAR uma PROVA----
const criar = (novaProva) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }
      //----Função TRIM para não permitir campo vazios nas COLUNAS----
      if (
        novaProva.tipo.trim() === "" ||
        novaProva.descricao.trim() === "" ||
        novaProva.enunciado.trim() === ""
      ) {
        connection.rollback(() =>
          reject(new Error("Enunciado, descrição e tipo não podem ser vazios."))
        );
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
              if (novaProva.questoes && novaProva.questoes.length > 0) {
                await Promise.all(
                  novaProva.questoes.map(async (enunciado) => {
                    await inserirQuestaoPorEnunciado(novaProvaId, enunciado);
                  })
                );
              }
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
                      console.log(questoes);
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

//----Função para LISTAR varias PROVAS de um PROFESSOR----
const listar = (idProfessor) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT p.id_prova, p.descricao, p.tipo, p.professor_pessoa_id_pessoa, p.enunciado, pp.nome AS professor_nome
       FROM infocimol.prova p
       JOIN pessoa pp ON p.professor_pessoa_id_pessoa = pp.id_pessoa
       JOIN usuario up ON pp.id_pessoa = up.pessoa_id_pessoa
       WHERE p.professor_pessoa_id_pessoa = ?
       ORDER BY p.id_prova DESC`,
      [idProfessor],
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

//----Função para LISTAR todas as PROVAS do BD----
const getProvas = (id) => {
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

//----Função para OBTER as QUESTÕES de uma PROVA----
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

//----Função para OBTER as ALTERNATIVAS de uma QUESTÃO----
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

//----Função para ATUALIZAR uma PROVA----
const editarProva = (enunciado, descricao, tipo, idProva) => {
  //----Função TRIM para não permitir campo vazios nas COLUNAS----
  if (
    enunciado.trim() === "" ||
    descricao.trim() === "" ||
    tipo.trim() === ""
  ) {
    throw new Error("Enunciado, descrição e tipo não podem ser vazios.");
  }

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
          //----ATUALIZA AS INFOs no BD----
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

//----Função para DELETAR uma PROVA----
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

//Função para fazer uma BUSCA pelo ENUNCIADO de uma PROVA----
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

//----Função para GERAR um PDF----
const gerarPDF = (prova) => {
  if (!prova || !prova.id_prova) {
    throw new Error("Prova inválida");
  }
  const imagePath = "./src/model/img/logo.jpeg";
  const nomeArquivo = `prova_${prova.enunciado}.pdf`;
  const stream = fs.createWriteStream(nomeArquivo);
  const doc = new PDFDocument();
  doc.info.Title = `Prova ${prova.id_prova}`;

  const larguraImagem = 35;

  const yPos = doc.y + 20;

  doc.image(imagePath, 48, yPos, { width: larguraImagem });

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(
      "ESCOLA TÉCNICA ESTADUAL MONTEIRO LOBATO",
      60 + larguraImagem + 15,
      yPos
    );
  if (prova.questoes && prova.questoes.length > 0) {
    const QuestoesRandom = ArrayRandom(prova.questoes);
    if (QuestoesRandom.length > 0) {
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(
          `${QuestoesRandom[0].topicos.disciplina.questao_topico_disciplina_nome} - ${prova.criado_por.professor_nome}`,
          60 + larguraImagem + 15,
          doc.y + 10
        );
    }
  }
  doc
    .font("Helvetica")
    .fontSize(12)
    .text("      Nota:", (doc.page.width / 3) * 2, 120);

  doc.moveDown(2);

  doc.roundedRect(45, doc.y, doc.page.width - 105, 50, 10).stroke();

  doc
    .font("Helvetica")
    .fontSize(12)
    .text(
      "        Nome: ___________________________________   Turma: ________  Data: __/__/____ ",
      31,
      doc.y + 19
    );

  doc.moveDown(1);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Orientações`, 50, doc.y + 20);
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(`${prova.descricao}`, { align: "left" })
    .moveDown(0.5);
  doc.moveDown(2);
  //----Array que armazena as QUESTÕES da PROVA em ordem aleatória----
  function ArrayRandom(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  //----Adiciona as QUESTÕES da PROVA----
  if (prova.questoes && prova.questoes.length > 0) {
    //----Questões da PROVA em ORDEM aleatória----
    const QuestoesRandom = ArrayRandom(prova.questoes);
    QuestoesRandom.forEach((questao, index) => {
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`${index + 1}) ${questao.questao_enunciado}`, {
          align: "justify",
        });
      doc.moveDown(1);
      //Alternativas de cada QUESTÃO em ORDEM aleatória----
      if (questao.alternativas && questao.alternativas.length > 0) {
        const RandomAlternativas = ArrayRandom(questao.alternativas);
        RandomAlternativas.forEach((alternativa, index) => {
          doc.text(
            `${String.fromCharCode(97 + index)}) ${alternativa.enunciado}`,
            { align: "justify", indent: 20 }
          );
          doc.moveDown(0.8);
        });
      }

      doc.moveDown(1);
    });
  }

//----Adiciona o GABARITO da PROVA com as QUESTOES e ALTERNATIVAS CORRETAS----
const gabarito = prova.questoes.map((questao, index) => {
  const alternativasMapeadas = questao.alternativas.reduce((map, alt, i) => {
    map[alt.enunciado] = String.fromCharCode(97 + i);
    return map;
  }, {});

  const alternativaCorreta = questao.alternativas.find(
    (alternativa) => alternativa.correta === 1
  );

  if (alternativaCorreta) {
    const letraAlternativa = alternativasMapeadas[alternativaCorreta.enunciado];
    return `${index + 1})Resposta correta: ${letraAlternativa}) ${alternativaCorreta.enunciado}`;
  } else if(questao.questao_tipo === 'Dissertativa'){
    console.log(`Questão ${index + 1} é dissertativa`);
    return `${index + 1})Resposta esperada: ${questao.questao_resposta}`;
  }else if (alternativaCorreta === undefined){
    console.log(`Questão ${index + 1} não possui resposta correta`);
    return `${index + 1})Não possui resposta correta`;
  }
});

// Adiciona uma nova página para o gabarito
doc.addPage();

//----Adiciona o gabarito ao PDF----
doc.font("Helvetica-Bold").fontSize(12).text(`Gabarito`, 50, doc.y);

let linhaAtual = 0;

gabarito.forEach((item, index) => {
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(item, 50, doc.y + 10 + linhaAtual * 20, { align: "justify" })
    .moveDown(0.5);
});

stream.on("finish", () => {
  console.log(`Arquivo ${nomeArquivo} gerado com sucesso`);
});

doc.pipe(stream);
doc.end();

return nomeArquivo;
}

//----Função para OBTER uma PROVA específico pelo seu ID----
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
            resolve(null); //----Retorna NULL em caso de erro----
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
    }))[0]; //----Retorna apenas o primeiro elemento do ARRAY----

    return prova;
  } catch (error) {
    return null; //----Retorna NULL em caso de erro----
  }
};

module.exports = {
  criar,
  listar,
  getQuestoes,
  editarProva,
  excluirProva,
  obterProvaPorId,
  getAlternativas,
  buscarProvaPorEnunciado,
  gerarPDF,
  getProvas,
};
