const listarQuestaoModel = require("../model/listarQuestaoModel");

exports.get = async (headers) => {
    try {
        const questoes = await listarQuestaoModel.get();
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

exports.listar = async (body) => {
    const result = await listarQuestaoModel.listar(body);
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