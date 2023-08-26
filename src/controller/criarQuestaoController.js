const criarQuestaoModel = require("../model/criarQuestaoModel");

exports.get = async (headers) => {
    try {
        const questoes = await criarQuestaoModel.get();
        return {
            status: "success",
            msg: "Questões obtidas com sucesso!",
            questoes,
        };
    } catch (error) {
        console.error("Erro ao obter questões:", error);
        return {
            status: "error",
            msg: "Ocorreu um erro ao obter as questões. Por favor, tente novamente mais tarde.",
        };
    }
};

exports.criar = async (body) => {
    try {
      const newQuestionId = await criarQuestaoModel.create(body);
      const questionDetails = await criarQuestaoModel.getQuestionDetails(newQuestionId);
  
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

