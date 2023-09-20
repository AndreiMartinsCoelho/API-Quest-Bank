const AlternativasModel = require("../model/AlternativasModel");

//Função para obter as alternativas
exports.get = async (headers) => {
  try {
    const alternativas = await AlternativasModel.get();
    return {
      status: "success",
      msg: "Alternativas obtidas com sucesso!",
      alternativas,
    };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao obter alternativas:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter as alternativas. Por favor, tente novamente mais tarde.",
    };
  }
};

//Função para listar as alternativas
exports.listar = async (body) => {
  const result = await AlternativasModel.list(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Alternativas listadas com sucesso!",
      alternativas: result.alternativas,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
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
        msg: "Por favor, forneça o enunciado da alternativa, o enunciado da questão e se a alternativa é correta no corpo da requisição.",
      };
    }

    const questaoId = await AlternativasModel.obterIdQuestaoPorEnunciado(
      enunciadoQuestao
    );

    if (!questaoId) {
      return {
        status: "error",
        msg: "Questão não encontrada com o enunciado fornecido.",
      };
    }

    const newAlternative = await AlternativasModel.criarAlternativa(
      enunciado,
      questaoId,
      correta
    );

    return {
      status: "success",
      msg: "Alternativa criada com sucesso!",
      alternativa: newAlternative,
    };
  } catch (error) {
    console.error("Erro ao criar alternativa:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao criar a alternativa. Por favor, tente novamente mais tarde.",
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
                msg: "Alternativa editada com sucesso!"
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao editar a alternativa. Por favor, tente novamente."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao editar a alternativa. Por favor, tente novamente."
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
                msg: "Alternativa excluída com sucesso!"
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao excluir a alternativa. Por favor, tente novamente."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao excluir a alternativa. Por favor, tente novamente."
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
                msg: "Alternativa obtida com sucesso!",
                alternativa: result,
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Erro ao obter a alternativa. Por favor, tente novamente."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Erro ao obter a alternativa. Por favor, tente novamente."
        });
    }
}
