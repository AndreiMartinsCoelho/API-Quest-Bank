const disciplinaModel = require('../model/disciplinaModel');

//Função para obter as disciplinas
exports.get = async (headers) => {
    try {
        const disciplinas = await disciplinaModel.get();
        return { status: "success", msg: "Disciplinas obtidas com sucesso!", disciplinas };
    } catch (error) {
        // Tratar erro caso ocorra na consulta ao banco de dados
        console.error("Erro ao obter disciplinas:", error);
        return { status: "error", msg: "Ocorreu um erro ao obter as disciplinas. Por favor, tente novamente mais tarde." };
    }
};

//Função para listar as disciplinas
exports.listar = async (body) => {
    const result = await disciplinaModel.list(body);
    if (result.auth) {
        return { status: "success", msg: "Disciplinas listadas com sucesso!", disciplinas: result.disciplinas };
    } else {
        // Tratar caso em que não há autenticação
        return { status: "error", msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente." };
    }
};

//Função para obter disciplina por id por parâmetro
exports.getById = async (params) => {
    const { id } = params;
    try {
        const disciplina = await disciplinaModel.getById(id);
        return { status: "success", msg: "Disciplina obtida com sucesso!", disciplina };
    } catch (error) {
        // Tratar erro caso ocorra na consulta ao banco de dados
        console.error("Erro ao obter disciplina:", error);
        return { status: "error", msg: "Ocorreu um erro ao obter a disciplina. Por favor, tente novamente mais tarde." };
    }
};