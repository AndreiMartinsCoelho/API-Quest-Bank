const criarTopicoModel = require("../model/criarTopicoModel");

exports.criar = async (data) => {
  try {
    const { enunciado, nome_disciplina } = data;

    if (!enunciado || !nome_disciplina) {
      return {
        status: "error",
        msg: "Por favor, forneça o enunciado do tópico e o nome da disciplina no corpo da requisição.",
      };
    }

    const professorId = data && data["professorId"];

    if (!professorId) {
      return {
        status: "error",
        msg: "O ID do professor não foi fornecido no cabeçalho da requisição.",
      };
    }

    const disciplinaId = await criarTopicoModel.getDisciplinaIdByNome(
      nome_disciplina
    );

    if (!disciplinaId) {
      return {
        status: "error",
        msg: "Disciplina não encontrada com o nome fornecido.",
      };
    }

    const newTopic = await criarTopicoModel.createTopic(
      enunciado,
      disciplinaId,
      professorId
    );

    return {
      status: "success",
      msg: "Tópico criado com sucesso!",
      topico: newTopic,
    };
  } catch (error) {
    console.error("Erro ao criar tópico:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao criar o tópico. Por favor, tente novamente mais tarde.",
    };
  }
};

exports.get = async () => {
  try {
    const topics = await criarTopicoModel.getAllTopics();
    return { status: "success", msg: "Tópicos obtidos com sucesso!", topics };
  } catch (error) {
    console.error("Erro ao obter tópicos:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter os tópicos. Por favor, tente novamente mais tarde.",
    };
  }
};
