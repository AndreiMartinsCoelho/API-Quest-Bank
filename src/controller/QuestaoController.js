const QuestaoModel = require("../model/QuestaoModel");

//Função para obter as questões
exports.get = async (headers) => {
    try {
        const questoes = await QuestaoModel.get();
        return {
        status: "success",
        msg: "Questões obtidas com sucesso!",
        questoes,
        };
    } catch (error) {
        // Tratar erro caso ocorra na consulta ao banco de dados
        console.error("Erro ao obter questões:", error);
        return {
        status: "error",
        msg: "Ocorreu um erro ao obter as questões. Por favor, tente novamente mais tarde.",
        };
    }
};

//Função para listar as questões
exports.listar = async (body) => {
    const result = await QuestaoModel.list(body);
    if (result.auth) {
        return {
        status: "success",
        msg: "Questões listadas com sucesso!",
        questoes: result.questoes,
        };
    } else {
        // Tratar caso em que não há autenticação
        return {
        status: "error",
        msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
        };
    }
};

//Função para criar a questão
exports.criar = async (body) => {
    try {
      const newQuestionId = await QuestaoModel.create(body);
      const questionDetails = await QuestaoModel.getQuestionDetails(newQuestionId);
  
      return {
        status: 200,
        msg: "Questão criada com sucesso!",
        resp: [questionDetails],
      };
    } catch (error) {
      console.error("Erro ao criar a questão:", error);
      return {
        status: "error",
        msg: "Ocorreu um erro ao criar a questão. Por favor, tente novamente.",
      };
    }
};