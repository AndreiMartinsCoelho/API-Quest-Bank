const listarAlternativasModel = require('../model/listarAlternativasModel');

exports.get = async (headers) => {
    try {
        const alternativas = await listarAlternativasModel.get();
        return { status: "success", msg: "Alternativas obtidas com sucesso!", alternativas };
    } catch (error) {
        // Tratar erro caso ocorra na consulta ao banco de dados
        console.error("Erro ao obter alternativas:", error);
        return { status: "error", msg: "Ocorreu um erro ao obter as alternativas. Por favor, tente novamente mais tarde." };
    }
}

exports.listar = async (body) => {
    const result = await listarAlternativasModel.listar(body);
    if (result.auth) {
        return { status: "success", msg: "Alternativas listadas com sucesso!", alternativas: result.alternativas };
    } else {
        // Tratar caso em que não há autenticação
        return { status: "error", msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente." };
    }
}