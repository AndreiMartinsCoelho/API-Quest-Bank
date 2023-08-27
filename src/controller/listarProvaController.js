const listarProvaModel = require("../model/listarProvaModel");

exports.get = async (headers) => {
  try {
    const provas = await listarProvaModel.get();
    return {
      status: "success",
      msg: "Provas obtidas com sucesso!",
      provas,
    };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao obter Provas:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter as Provas. Por favor, tente novamente mais tarde.",
    };
  }
};

exports.listar = async (body) => {
  const result = await listarProvaModel.listar(body);
  if (result.auth) {
    return {
      status: "success",
      msg: "Provas listadas com sucesso!",
      provas: result.provas,
    };
  } else {
    // Tratar caso em que não há autenticação
    return {
      status: "error",
      msg: "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
    };
  }
};