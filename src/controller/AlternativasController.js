const AlternativasModel = require("../model/AlternativasModel");

//----Função para LISTAR as ALTERNATIVAS----
exports.get = async (req, res) => {
  const result = await AlternativasModel.get(req.body);
  if (result) {
    return res.status(200).json({
      status: "success",
      msg: "Alternativas obtidas com sucesso...",
      alternativas: result,
    })
  } else {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Você não está autenticado...",
    })
  }
};

//----Função para ADICIONAR a ALTERNATIVA----
exports.criar = async (data) => {
  try {
    const { enunciado, enunciadoQuestao, correta } = data;

    if (!enunciado || !enunciadoQuestao || !correta) {
      return {
        status: "error",
        msg: "Por favor, preencha todos os campos corretamente...",
      };
    }

    const questaoId = await AlternativasModel.obterIdQuestaoPorEnunciado(
      enunciadoQuestao
    );

    if (!questaoId) {
      return {
        status: "error",
        msg: "Por favor, preencha todos os campos corretamente...",
      };
    }

    const newAlternative = await AlternativasModel.criarAlternativa(
      enunciado,
      questaoId,
      correta
    );

    return {
      status: "success",
      msg: "Alternativa adicionada com sucesso...",
      alternativa: newAlternative,
    };
  } catch (error) {
    console.error("Erro ao adicionar alternativa...", error);
    return {
      status: "error",
      msg: "Ops! Ocorreu algum erro ao adicionar a alternativa...",
    };
  }
};

//----Função para EDITAR a ALTERNATIVA----
exports.editar = async (req, res) => {
    const idAlternativa = req.params.id;
    const { enunciado, correta } = req.body;
    try {
        const success = await AlternativasModel.editarAlternativa(enunciado, correta, idAlternativa);

        if(!enunciado || !correta){
          return res.status(404).json({
            stauts:"error",
            msg:"Ops! Ocorreu algum erro ao atualizar a alternativa..."
          })
        }else{
          return res.status(200).json({
            status: "success",
            msg: "Alternativa atualizada com sucesso...",
            alternativa: success
          });
        }
    } catch (error) {
        return res.status(404).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao atualizar a alternativa..."
        });
    }
}

//----Função para DELETAR a ALTERNATIVA----
exports.excluir = async (req, res) => {
    const idAlternativa = req.params.id;
    try {
        const success = await AlternativasModel.excluirAlternativa(idAlternativa);
        if (success) {
            return res.status(200).json({
                status: "success",
                msg: "Alternativa deletada com sucesso..."
            });
        } else {
            return res.status(404).json({
                status: "error",
                msg: "Ops! Ocorreu algum erro ao deletar a alternativa..."
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao deletar a alternativa..."
        });
    }
}

//----Função para OBTER uma ALTERNATIVA pelo ID----
exports.obterAlternativa = async (req, res) => {
    const idAlternativa = req.params.id;
    try {
        const result = await AlternativasModel.obterAlternativaPorId(idAlternativa);
        if (result) {
            return res.json({
                status: "success",
                msg: "Alternativa obtida com sucesso...",
                alternativa: result,
            });
        } else {
            return res.status(404).json({
                status: "error",
                msg: "Ops! Ocorreu algum erro ao obter a alternativa..."
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao obter a alternativa..."
        });
    }
}
