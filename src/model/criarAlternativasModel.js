const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

//Função para criar um alternativa
const criarAlternativa = async (enunciado, idQuestao, correta) => {
    try {
        const novoIdAlternativa = await obterNovoIdAlternativa();

        await new Promise((resolve, reject) => {
            connection.query(
                `INSERT INTO alternativa (id_alternativa, enunciado, questao_id_questao, correta) VALUES (?, ?, ?, ?)`,
                [novoIdAlternativa, enunciado, idQuestao, correta],
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
            id_alternativa: novoIdAlternativa,
            enunciado,
            questao: {
                id_questao: idQuestao,
            },
            correta,
        };
    }
    catch (error) {
        return null; // Retorna null em caso de erro
    }
};

// Função para obter o id da questao pelo enunciado
const obterIdQuestaoPorEnunciado = async (enunciadoQuestao) => {
    try {
        const resultados = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT id_questao FROM questao WHERE enunciado = ? LIMIT 1`,
                [enunciadoQuestao],
                (error, resultados) => {
                    if (error) {
                        resolve(null); // Retorna null em caso de erro
                    } else {
                        resolve(resultados);
                    }
                }
            );
        });

        if (resultados && resultados.length > 0) {
            return resultados[0].id_questao;
        } else {
            return null; // Retorna null se não encontrar
        }
    } catch (error) {
        return null; // Retorna null em caso de erro
    }
};

//Função para obter todas as alternativas
const get = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT a.id_alternativa, a.correta, a.questao_id_questao, a.enunciado
            FROM infocimol.alternativa a
            JOIN questao q ON a.questao_id_questao = q.id_questao;`,
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const alternativas = results.map((alternativa) => ({
                        id_alternativa: alternativa.id_alternativa,
                        correta: alternativa.correta,
                        questao: {
                            id_questao: alternativa.questao_id_questao,
                        },
                        enunciado: alternativa.enunciado
                    }));
                    resolve(alternativas);
                }
            }
        );
    });
}

// Função para obter o id da alternativa
const obterNovoIdAlternativa = async () => {
    try {
        const resultados = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT MAX(id_alternativa) as id FROM alternativa`,
                (error, resultados) => {
                    if (error) {
                        resolve(null); // Retorna null em caso de erro
                    } else {
                        resolve(resultados);
                    }
                }
            );
        });

        const novoIdAlternativa = resultados[0].id + 1;
        return novoIdAlternativa;
    } catch (error) {
        return null; // Retorna null em caso de erro
    }
}

module.exports = { criarAlternativa, obterIdQuestaoPorEnunciado, obterNovoIdAlternativa, get };