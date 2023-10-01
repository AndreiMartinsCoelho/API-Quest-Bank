const QuestaoModel = require("../model/QuestaoModel");

//Função para obter as questões
exports.get = async (headers) => {
    try {
        const questoes = await QuestaoModel.get();
        return {
        status: "success",
        msg: "Questões obtidas com sucesso...",
        questoes,
        };
    } catch (error) {
        // Tratar erro caso ocorra na consulta ao banco de dados
        console.error("Erro ao listar as questões:", error);
        return {
        status: "error",
        msg: "Ops! ocorreu um erro fatal ao listar as questões...",
        };
    }
};

//Função para listar as questões
exports.listar = async (body) => {
    const result = await QuestaoModel.get(body);
    if (result.auth) {
        return {
        status: "success",
        msg: "Questões listadas com sucesso em ordem inversa...",
        questoes: result.questoes,
        };
    } else {
        // Tratar caso em que não há autenticação
        return {
        status: "error",
        msg: "Ops! ocorreu um erro de login...",
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
        msg: "Questão adicionada com sucesso...",
        resp: [questionDetails],
      };
    } catch (error) {
      console.error("Erro ao adicionar a questão:", error);
      return {
        status: "error",
        msg: "Ops! ocorreu um erro fatal ao adicionar a questão...",
      };
    }
};

//Função para editar a questão
exports.editar = async (req, res) => {
    const idQuestao = req.params.id;
    const { tipo, nivel, enunciado, Enunciado_imagem, resposta } = req.body;
    try {
        const updatedQuestion = await QuestaoModel.editarQuestao(tipo, nivel, enunciado, Enunciado_imagem, resposta, idQuestao);
        if (updatedQuestion) {
            return res.json({
                status: "success",
                msg: "Questão atualizada com sucesso...",
                data: updatedQuestion
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! ocorreu um erro ao atualizar a questão..."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! ocorreu um erro fatal ao atualizar a questão..."
        });
    }
}

//Função para excluir a questão
exports.excluir = async (req, res) => {
    const idQuestao = req.params.id;
    try {
        const success = await QuestaoModel.excluirQuestao(idQuestao);
        if (success) {
            return res.json({
                status: "success",
                msg: "Questão deletada com sucesso..."
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! ocorreu um erro ao deletar a questão...",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! ocorreu um erro fatal ao deletar a questão...",
        });
    }
};

//Função para obter uma questao específica pelo id
exports.obterQuestao = async (req, res) => {
    const idQuestao = req.params.id;
    try {
        const result = await QuestaoModel.verQuestao(idQuestao);
        if (result) {
            return res.json({
                status: "success",
                msg: "Questão obtida com sucesso...",
                questao: result
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! ocorreu um erro ao obter a questão...",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! ocorreu um erro fatal ao obter a questão...",
        });
    }
};
