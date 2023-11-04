const TopicoModel = require("../model/TopicoModel");

//----Função para ADICIONAR um TOPICO----
exports.criar = async (req, res) => {
  try {
    const { enunciado, nome_disciplina } = req.body;

    if (!enunciado || !nome_disciplina) {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Preencha todos os campos obrigatórios...",
      })
    }

    const professorId = req.body["professorId"];

    if (!professorId) {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Você precisa estar logado para adicionar um tópico..."
      })
    }

    const disciplinaId = await TopicoModel.obterIdDisciplinaPorNome(nome_disciplina);

    if (!disciplinaId) {
      return res.status(404).json({
        status: "error",
        msg: "Ops! A disciplina informada não existe..."
      })
    }

    const newTopic = await TopicoModel.criarTopico(
      enunciado,
      disciplinaId,
      professorId
    );

    return res.status(200).json({
      status: "success",
      msg: "Tópico adicionado com sucesso...",
      topico: newTopic,
    })
  } catch (error) {
    console.error("Erro ao adicionar o tópico:", error);
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocrreu um erro fatal ao adicionar o tópico...",
    })
  }
};

//----Função para LISTAR os TOPICOS com PROF----
exports.get = async (req, res) => {
  const idProfessor = req.query.idProfessor;
  try {
    res.status(200).json({
      status: "success",
      msg: "Tópicos obtidos com sucesso!",
      topicos: await TopicoModel.obterTodosOsTopicos(idProfessor),
    })
  } catch (error) {
    res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro ao obter os tópicos...",
    });
  }
};

//----Função para LSITAR todos os TOPICOS sem PROF----
exports.getTodosTopicos = async (req, res) => {
  const topicos = await TopicoModel.getTopicos();
  try{
    res.status(200).json({
      status:"sucess",
      msg:"Tópicos obtidos com sucesso!",
      topicos: topicos
    })
  }catch(error){
    res.status(404).json({
      status: "error",
      msg:"Ops! Ocorreu um erro ao obter os tópicos..."
    });
  }
}

//----Função para DELETAR um TOPICO----
exports.excluir = async (req, res) => {
  const idTopico = req.params.id; //----Extrai o ID da URL----
  console.log(idTopico);
  try {
    const result = await TopicoModel.excluir(idTopico);
    if (result.auth) {
      return res.status(200).json({
        status: "success",
        msg: "Tópico excluído com sucesso...",
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Você precisa estar logado...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao deletar o tópico...",
    });
  }
};

//----Função para ATUALIZAR um TOPICO----
exports.editar = async (req, res) => {
  const idTopico = req.params.id;
  const enunciado = req.body.enunciado.toString();
  try {
    const result = await TopicoModel.editar(idTopico, enunciado);
    if (result) {
      return res.status(200).json({
        status: "success",
        msg: "Tópico atualizado com sucesso...",
        topico: result,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Ocorreu um erro fatal ao atualizar o tópico...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro ao atualizar o tópico...",
    });
  }
};

//----Função para LISTAR um TOPICO pelo ID----
exports.listaId = async (req, res) => {
    const idTopico = req.params.id;
    try {
        const result = await TopicoModel.obterTopicoPorId(idTopico);
        if (result) {
            return res.status(200).json({
                status: "success",
                msg: "Tópico obtido com sucesso...",
                topico: result,
            });
        } else {
            return res.status(404).json({
                status: "error",
                msg: "Ops! Ocorreu um erro ao obter o tópico...",
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: "error",
            msg: "Ops! Ocorreu um erro fatal ao obter o tópico...",
        });
    }
};

//----Função para BUSCAR um TOPICO pelo ENUNCIADO----
exports.buscar = async (req, res) => {
  const enunciado = req.params.enunciado;
  try {
    const topico = await TopicoModel.obterTopicoPorEnunciado(enunciado);
    if (topico) {
      return res.status(200).json({
        status: 'success',
        msg: 'Tópico encontrado com sucesso...',
        topico: topico
      });
    } else {
      return res.status(404).json({
        status: 'error',
        msg: 'Tópico não encontrado...',
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      msg: 'Ops! ocorreu um erro ao buscar o tópico...',
    });
  }
};
