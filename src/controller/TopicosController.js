const TopicoModel = require("../model/TopicoModel");

//Função para listar o tópico
exports.listar = async (body) => {
  const result = await TopicoModel.list(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Topicos listados com sucesso!",
      topicos: result.topicos,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
    };
  }
};

//Função para criar o tópico
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

    const disciplinaId = await TopicoModel.obterIdDisciplinaPorNome(
      nome_disciplina
    );

    if (!disciplinaId) {
      return {
        status: "error",
        msg: "Disciplina não encontrada com o nome fornecido.",
      };
    }

    const newTopic = await TopicoModel.criarTopico(
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

//Função para obter todos os tópicos
exports.get = async () => {
  try {
    const topics = await TopicoModel.obterTodosOsTopicos();
    return { status: "success", msg: "Tópicos obtidos com sucesso!", topics };
  } catch (error) {
    console.error("Erro ao obter tópicos:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter os tópicos. Por favor, tente novamente mais tarde.",
    };
  }
};
