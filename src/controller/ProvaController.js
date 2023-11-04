const ProvaModel = require("../model/ProvaModel");
const fs = require("fs");

//----Função de LISTAR de PROVAS com PROFESSOR----
exports.listar = async (req, res) => {
  const idProfessor = req.query.idProfessor;
  try {
    const provas = await ProvaModel.listar(idProfessor);
    res.status(200).json({
      status: "success",
      msg: "Provas listadas com sucesso...",
      provas: provas,
    });
  } catch (error) {
    console.error("Erro ao listar Provas:", error);
    res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    });
  }
};

//----Função para LISTAR as PROVAS sem FILTRO----
exports.listarProvas = async (req, res) => {
  const provas = await ProvaModel.getProvas();
  try {
    res.status(200).json({
      status: "success",
      msg: "Provas listadas com sucesso...",
      provas: provas,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    });
  }
};

//----Função para ADICIONAR a PROVA----
exports.criar = async (req, res) => {
  try {
    const result = await ProvaModel.criar(req.body);

    if (result.novaProvaId) {
      const provaCriada = result.provaDetalhes;

      const questoes = result.questoes.map((questaoId) => {
        const questaoEncontrada = req.body.questoes.find(
          (questao) => questao.id_questao === questaoId
        );

        if (questaoEncontrada) {
          return {
            enunciado_questao: questaoId,
          };
        } else {
          return {
            questao: questaoId,
          };
        }
      });

      return res.status(200).json({
        status: "success",
        msg: "Prova criada com sucesso...",
        provas: [provaCriada],
        questoes: questoes,
      });
    }
  } catch (error) {
    console.error("Erro ao criar prova:", error);
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu algum erro ao criar prova...",
    });
  }
};

//----Função para ATUALIZAR a PROVA----
exports.editar = async (req, res) => {
  const idProva = req.params.id;
  const { enunciado, descricao, tipo } = req.body;
  console.log(req.body);
  try {
    const prova = await ProvaModel.editarProva(
      enunciado,
      descricao,
      tipo,
      idProva
    );
    if (prova) {
      return res.status(200).json({
        status: "success",
        msg: "Prova atualizada com sucesso...",
        prova: prova,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Ocorreu um erro ao atualizar a prova...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao atualizar a prova..",
    });
  }
};

//----Função para DELETAR a PROVA----
exports.excluir = async (req, res) => {
  const idProva = req.params.id;
  try {
    const success = await ProvaModel.excluirProva(idProva);
    if (success) {
      return res.status(200).json({
        status: "success",
        msg: "Prova deletada com sucesso...",
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Ocorreu um erro ao deletar a prova...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao deletar a prova..",
    });
  }
};

//----Função para OBTER uma PROVA pelo ID----
exports.obterProva = async (req, res) => {
  const idProva = req.params.id;
  try {
    const result = await ProvaModel.obterProvaPorId(idProva);
    if (result) {
      return res.status(200).json({
        status: "success",
        msg: "Prova listada com sucesso...",
        prova: result,
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "Ops! Ocorreu um erro ao listar a prova...",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao listar a prova..",
    });
  }
};

//----Função para BUSCAR uma prova por ENUNCIADO----
exports.buscarProvaPorEnunciado = async (req, res) => {
  const enunciado = req.params.enunciado;
  try {
    const provas = await ProvaModel.buscarProvaPorEnunciado(enunciado);
    return res.status(200).json({
      status: "success",
      msg: "Provas encontradas com sucesso...",
      provas: provas,
    })
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: "Ops! ocorreu um erro ao buscar as provas...",
    });
  }
};

//----Função para GERAR a PROVA em PDF----
exports.gerarProva = async (req, res) => {
  try {
    const prova = await ProvaModel.obterProvaPorId(req.params.id);

    if (!prova) {
      return res.status(404).json({ 
        error: "Prova não encontrada" 
      });
    }

    const gerarPDF = ProvaModel.gerarPDF;
    const nomeArquivo = gerarPDF(prova);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${nomeArquivo}`);
    const stream = fs.createReadStream(nomeArquivo);

    stream.on("open", () => {
      stream.pipe(res);
    });

    stream.on("end", () => {
      fs.unlinkSync(nomeArquivo); //----Remova o PDF após o ENVIO----
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(404).json({ 
        error: "Erro ao enviar o arquivo PDF" 
      });
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ 
      error: "Erro ao gerar a prova" 
    });
  }
};
