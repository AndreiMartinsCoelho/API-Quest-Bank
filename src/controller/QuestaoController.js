const QuestaoModel = require("../model/QuestaoModel");

//----Função para LISTAR as QUESTÕES por PROFESSOR----
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
    res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    });
  }
};

//----Função para LISTAR as QUESTÕES sem ser por PROFESSOR----
exports.getQuestoes = async (req,res)=>{
  const questoes = await QuestaoModel.getQuestoes();
  try{
    res.status(200).json({
      status: "success",
      msg: "Questões obtidas com sucesso...",
      questoes: questoes,
    });
  }catch(error){
    console.error("Erro ao listar as questões:", error);
    res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    });
  }
}

//----Função para ADICIONAR uma QUESTÃO----
exports.criar = async (req, res) => {
  try {
    const newQuestionId = await QuestaoModel.create(req.body);
    const questionDetails = await QuestaoModel.getQuestionDetails(
      newQuestionId
    );

    return res.status(200).json({
      status: "success",
      msg: "Questão adicionada com sucesso...",
      resp: [questionDetails],
    })
  } catch (error) {
    console.error("Erro ao adicionar a questão:", error);
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro fatal ao adicionar a questão...",
    })
  }
};

//----Função para ATUALIZAR uma QUESTÃO----
exports.editar = async (req, res) => {
  const idQuestao = req.params.id;
  const { tipo, nivel, enunciado, Enunciado_imagem, resposta } = req.body;
  try {
    const updatedQuestion = await QuestaoModel.editarQuestao(tipo, nivel, enunciado, Enunciado_imagem, resposta, idQuestao);
    console.log(updatedQuestion);
    if (updatedQuestion) {
      return res.status(200).json({
        status: "success",
        msg: "Questão atualizada com sucesso...",
        data: updatedQuestion,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! ocorreu um erro ao atualizar a questão...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro fatal ao atualizar a questão...",
    });
  }
};

//----Função para DELETAR uma QUESTÃO----
exports.excluir = async (req, res) => {
  const idQuestao = req.params.id;
  try {
    const success = await QuestaoModel.excluirQuestao(idQuestao);
    if (success) {
      return res.status(200).json({
        status: "success",
        msg: "Questão deletada com sucesso...",
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! ocorreu um erro ao deletar a questão...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro fatal ao deletar a questão...",
    });
  }
};

//----Função para OBTER uma QUESTÃO específica pelo ID----
exports.obterQuestao = async (req, res) => {
  const idQuestao = req.params.id;
  try {
    const result = await QuestaoModel.verQuestao(idQuestao);
    if (result) {
      return res.status(200).json({
        status: "success",
        msg: "Questão obtida com sucesso...",
        questao: result,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! ocorreu um erro ao obter a questão...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro fatal ao obter a questão...",
    });
  }
};

//----Função para BUSCAR uma QUESTÃO específica pelo ENUNCIADO----
exports.buscarQuestoesPorEnunciado = async (req, res) => {
  const enunciado = req.params.enunciado;
  try {
    const questoes = await QuestaoModel.buscarQuestoesPorEnunciado(enunciado);
    if (questoes.length > 0) {
      return res.status(200).json({
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
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro ao buscar as questões...",
    });
  }
};
