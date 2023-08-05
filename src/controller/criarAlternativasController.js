const criarAlternativasModel = require('../model/criarAlternativasModel');

exports.criar = async (data) => {
    try {
        const { enunciado, enunciadoQuestao, correta } = data;

        if (!enunciado || !enunciadoQuestao || !correta) {
            return { status: "error", msg: "Por favor, forneça o enunciado da alternativa, o enunciado da questão e se a alternativa é correta no corpo da requisição." };
        }

        const questaoId = await criarAlternativasModel.obterIdQuestaoPorEnunciado(enunciadoQuestao); // Correção aqui

        if (!questaoId) {
            return { status: "error", msg: "Questão não encontrada com o enunciado fornecido." };
        }

        const newAlternative = await criarAlternativasModel.criarAlternativa(enunciado, questaoId, correta); // Correção aqui

        return { status: "success", msg: "Alternativa criada com sucesso!", alternativa: newAlternative };
    } catch (error) {
        console.error("Erro ao criar alternativa:", error);
        return { status: "error", msg: "Ocorreu um erro ao criar a alternativa. Por favor, tente novamente mais tarde." };
    }
}

exports.get = async () => {
    try {
        const alternatives = await criarAlternativasModel.getAllAlternatives();
        return { status: "success", msg: "Alternativas obtidas com sucesso!", alternatives };
    } catch (error) {
        console.error("Erro ao obter alternativas:", error);
        return { status: "error", msg: "Ocorreu um erro ao obter as alternativas. Por favor, tente novamente mais tarde." };
    }
};
