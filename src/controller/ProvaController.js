const ProvaModel = require("../model/ProvaModel");
const fs = require('fs');

//Função para obter as provas
exports.get = async (headers) => {
  try {
    const provas = await ProvaModel.get();
    return {
      status: "success",
      msg: "Provas obtidas com sucesso...",
      provas,
    };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao obter Provas:", error);
    return {
      status: "error",
      msg: "Ops! Ocorreu um erro ao obter as provas...",
    };
  }
};

//Função para listar as provas
exports.listar = async (body) => {
  const result = await ProvaModel.listar(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Provas listadas com sucesso...",
      provas: result.provas,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Ops! Ocorreu algum erro...",
    };
  }
};

//Função para criar a prova
exports.criar = async (body) => {
  const result = await ProvaModel.criar(body);
  if (result.novaProvaId) {
    const provaCriada = result.provaDetalhes;

    const questoes = result.questoes.map((questaoId) => {
      const questaoEncontrada = body.questoes.find(
        (questao) => questao.id_questao === questaoId
      );

      if (questaoEncontrada) {
        return {
          enunciado_questao: questaoId,
        };
      } else {
        return {
          questao: questaoId
        };
      }
    });

    return {
      status: "success",
      msg: "Prova criada com sucesso...",
      provas: [provaCriada],
      questoes: questoes,
    };
  } else {
    // Tratar caso em que a prova não foi criada
    return {
      status: "error",
      msg: "Ops! Ocorreu algum erro ao criar prova..."
    };
  }
};

//Função para editar a prova
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
      return res.json({
        status: "success",
        msg: "Prova atualizada com sucesso...",
        prova: prova,
      });
    } else {
      return res.status(500).json({
        status: "error",
        msg: "Ops! Ocorreu um erro ao atualizar a prova...",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao atualizar a prova..",
    });
  }
};

//Função para excluir a prova
exports.excluir = async (req, res) => {
  const idProva = req.params.id;
  try {
    const success = await ProvaModel.excluirProva(idProva);
    if (success) {
      return res.json({
        status: "success",
        msg: "Prova deletada com sucesso...",
      });
    } else {
      return res.status(500).json({
        status: "error",
        msg: "Ops! Ocorreu um erro ao deletar a prova...",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "Ops! Ocorreu um erro fatal ao deletar a prova..",
    });
  }
};

//Função para obter uma prova pelo id
exports.obterProva = async (req, res) => {
    const idProva = req.params.id;
    try {
        const result = await ProvaModel.obterProvaPorId(idProva);
        if (result) {
            return res.json({
                status: "success",
                msg: "Prova listada com sucesso...",
                prova: result,
            });
        } else {
            return res.status(500).json({
                status: "error",
                msg: "Ops! Ocorreu um erro ao listar a prova...",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Ops! Ocorreu um erro fatal ao listar a prova..",
        });
    }
};

exports.buscarProvaPorEnunciado = async (req, res) => {
  const enunciado = req.params.enunciado;
  try {
    const provas = await ProvaModel.buscarProvaPorEnunciado(enunciado);
    return res.json({
      status: 'success',
      msg: 'Provas encontradas com sucesso...',
      provas: provas
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      msg: 'Ops! ocorreu um erro ao buscar as provas...',
    });
  }
};

//Função para gerar a prova em PDF
exports.gerarProva = async (req, res) => {
  try {
    const prova = await ProvaModel.obterProvaPorId(req.params.id);

    if (!prova) {
      return res.status(404).json({ error: 'Prova não encontrada' });
    }

    const gerarPDF = ProvaModel.gerarPDF;
    const nomeArquivo = gerarPDF(prova);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);
    const stream = fs.createReadStream(nomeArquivo);

    stream.on('open', () => {
      stream.pipe(res);
    });

    stream.on('end', () => {
      fs.unlinkSync(nomeArquivo); // Remova o arquivo após o envio
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Erro ao enviar o arquivo PDF' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar a prova' });
  }
};
