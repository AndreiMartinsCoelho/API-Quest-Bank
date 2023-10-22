const QuestaoModel = require("../model/QuestaoModel");

//Função para obter as questões
exports.get = async (req, res) => {
  const idProfessor = req.query.idProfessor;
  try {
    const questoes = await QuestaoModel.get(idProfessor);
    res.status(200).json({
      status: "success",
      msg: "Questões obtidas com sucesso...",
      questoes: questoes,
    });
  } catch (error) {
    console.error("Erro ao listar as questões:", error);
    res.status(500).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    });
  }
};

//Função para criar a questão
exports.criar = async (body) => {
  try {
    const newQuestionId = await QuestaoModel.create(body);
    const questionDetails = await QuestaoModel.getQuestionDetails(
      newQuestionId
    );

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
    const updatedQuestion = await QuestaoModel.editarQuestao(
      tipo,
      nivel,
      enunciado,
      Enunciado_imagem,
      resposta,
      idQuestao
    );
    if (updatedQuestion) {
      return res.json({
        status: "success",
        msg: "Questão atualizada com sucesso...",
        data: updatedQuestion,
      });
    } else {
      return res.status(500).json({
        status: "error",
        msg: "Ops! ocorreu um erro ao atualizar a questão...",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "Ops! ocorreu um erro fatal ao atualizar a questão...",
    });
  }
};

//Função para excluir a questão
exports.excluir = async (req, res) => {
  const idQuestao = req.params.id;
  try {
    const success = await QuestaoModel.excluirQuestao(idQuestao);
    if (success) {
      return res.json({
        status: "success",
        msg: "Questão deletada com sucesso...",
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
        questao: result,
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

//Função para obter uma questao específica pelo enunciado
exports.buscarQuestoesPorEnunciado = async (req, res) => {
  const enunciado = req.params.enunciado;
  try {
    const questoes = await QuestaoModel.buscarQuestoesPorEnunciado(enunciado);
    if (questoes.length > 0) {
      return res.json({
        status: "success",
        msg: "Questões encontradas com sucesso...",
        questoes: questoes,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Questões não encontradas...",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "Ops! ocorreu um erro ao buscar as questões...",
    });
  }
};
