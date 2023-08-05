const listarTopicoModel = require("../model/listarTopicoModel");

exports.get = async (headers) => {
  try {
    const topicos = await listarTopicoModel.get();
    return { status: "success", msg: "Topicos obtidos com sucesso!", topicos };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao obter topicos:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter os topicos. Por favor, tente novamente mais tarde.",
    };
  }
};

exports.listar = async (body) => {
  const result = await listarTopicoModel.listar(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Topicos listados com sucesso!",
      topicos: result.topicos,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
    };
  }
};
