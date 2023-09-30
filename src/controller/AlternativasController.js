const AlternativasModel = require("../model/AlternativasModel");

//Função para obter as alternativas
exports.get = async (headers) => {
  try {
    const alternativas = await AlternativasModel.get();
    return {
      status: "success",
      msg: "Alternativas obtidas com sucesso...",
      alternativas,
    };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao obter alternativas...", error);
    return {
      status: "error",
      msg: "Ocorreu algum erro ao obter as alternativas...",
    };
  }
};

//Função para listar as alternativas
exports.listar = async (body) => {
  const result = await AlternativasModel.list(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Alternativas obtidas com sucesso...",
      alternativas: result.alternativas,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Ops! Você não está autenticado...",
    };
  }
};

//Função para criar a alternativa
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

//Função para editar a alternativa
exports.editar = async (req, res) => {
    const idAlternativa = req.params.id;
    const { enunciado, correta } = req.body;
    try {
        const success = await AlternativasModel.editarAlternativa(enunciado, correta, idAlternativa);
        if (success) {
            return res.json({
                status: "success",
                msg: "Alternativa atualizada com sucesso...",
                alternativa: success
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! Ocorreu algum erro ao atualizar a alternativa..."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao atualizar a alternativa..."
        });
    }
}

//Função para excluir a alternativa
exports.excluir = async (req, res) => {
    const idAlternativa = req.params.id;
    try {
        const success = await AlternativasModel.excluirAlternativa(idAlternativa);
        if (success) {
            return res.json({
                status: "success",
                msg: "Alternativa deletada com sucesso..."
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! Ocorreu algum erro ao deletar a alternativa..."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao deletar a alternativa..."
        });
    }
}

//Função para obter uma alternativa pelo id
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
            return res.status(500).json({
                status: "error",
                msg: "Ops! Ocorreu algum erro ao obter a alternativa..."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! Ocorreu algum erro ao obter a alternativa..."
        });
    }
}
