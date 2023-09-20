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

//Função para editar a questão
exports.editar = async (req, res) => {
    const idQuestao = req.params.id;
    const { tipo, nivel, enunciado, Enunciado_imagem, resposta } = req.body;
    try {
        const success = await QuestaoModel.editarQuestao(tipo, nivel, enunciado, Enunciado_imagem, resposta, idQuestao);
        if (success) {
            return res.json({
                status: "success",
                msg: "Questão editada com sucesso!"
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao editar a questão."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao editar a questão."
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
                msg: "Questão excluída com sucesso! E todas as suas alternativas também foram excluídas(Todas as alternativas que estavam relacionadas a essa questão)."
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao excluir a questão.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao excluir a questão.",
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
                msg: "Questão obtida com sucesso!",
                questao: result
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao obter a questão.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao obter a questão.",
        });
    }
};
